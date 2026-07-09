import { useEffect, useState } from "react";

export default function Clock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-center py-2">

      <h2 className="text-sm font-bold">
        {now.toLocaleTimeString()}
      </h2>

      <p className="text-gray-500">
        {now.toDateString()}
      </p>

    </div>
  );
}