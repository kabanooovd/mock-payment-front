import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

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

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "50px auto",
        padding: 20,
        border: "1px solid #ccc",
      }}
    >
      <h2>Оплата бронирования</h2>
      <p>Сумма: {amountRub} ₽</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Номер карты:</label>
          <input
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Срок (MM/YY):</label>
          <input
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
            required
          />
        </div>
        <div>
          <label>CVV:</label>
          <input
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={processing}>
          {processing ? "Обработка..." : "Оплатить"}
        </button>
      </form>
      <small>
        Тестовые карты:
        <br />
        0000 0000 0000 0001 → Успех
        <br />
        0000 0000 0000 0002 → Недостаточно средств
        <br />
        Любая другая → Ошибка
      </small>
    </div>
  );
}

export default PaymentPage;
