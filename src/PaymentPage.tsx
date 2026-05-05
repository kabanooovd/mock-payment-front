import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import "./PaymentPage.css";
import { CardNumber, Cvv, ExpirationDate } from "./components";

interface PaymentInfo {
  paymentId: string;
  amount: number;
}

function PaymentPage() {
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get("paymentId");
  const amount = searchParams.get("amount");
  const [amountRub, setAmountRub] = useState<string | null>(null);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/pay-info?paymentId=${paymentId}&amount=${amount}`)
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json() as Promise<PaymentInfo>;
      })
      .then((data) => setAmountRub((data.amount / 100).toFixed(2)))
      .catch(() => setError("Ошибка загрузки информации о платеже"));
  }, [paymentId, amount]);

  if (!paymentId || !amount) {
    return (
      <div style={{ color: "red", padding: 20 }}>
        Некорректные параметры оплаты
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setError("");
    try {
      const res = await fetch("/api/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId, cardNumber, expiry, cvv }),
      });
      const data = (await res.json()) as { redirectUrl?: string };
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        setError("Не получен URL для перенаправления");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Ошибка соединения с сервером");
    } finally {
      setProcessing(false);
    }
  };

  if (error) return <div style={{ color: "red", padding: 20 }}>{error}</div>;
  if (!amountRub) return <div>Загрузка...</div>;

  const onSetCardData = () => {
    setCardNumber("0000 0000 0000 0001");
    setExpiry("12 / 32");
    setCvv("777");
  };

  return (
    <div className="PaymentPage_container">
      <h2 className="PaymentPage_header"> Моковая система оплаты</h2>
      <p className="PaymentPage_amount">Сумма: {amountRub} ₽</p>
      <form className="PaymentPage_form" onSubmit={handleSubmit}>
        <div className="PaymentPage_fields">
          <CardNumber
            label="Номер карты:"
            value={cardNumber}
            onChange={(val) => setCardNumber(val)}
          />
          <div className="PaymentPage_subfields">
            <ExpirationDate
              label="Срок (MM/YY):"
              value={expiry}
              onChange={(val) => setExpiry(val)}
            />
            <Cvv label="CVV:" value={cvv} onChange={(val) => setCvv(val)} />
          </div>
        </div>
        <button type="button" disabled={processing} onClick={onSetCardData}>
          {processing ? "Обработка..." : "Быстро подставить данные карты"}
        </button>
        <button type="submit" disabled={processing}>
          {processing ? "Обработка..." : "Оплатить"}
        </button>
      </form>
      <div className="info">
        Тестовые карты:
        <br />
        0000 0000 0000 0001 → Успех
        <br />
        0000 0000 0000 0002 → Недостаточно средств
        <br />
        Любая другая → Ошибка
      </div>
    </div>
  );
}

export default PaymentPage;
