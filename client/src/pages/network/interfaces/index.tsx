import { useEffect, useState } from "react";
import { getInterfaces } from "../../../services/network.service";

export default function InterfacesPage() {

  const [interfaces, setInterfaces] = useState<any[]>([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const data = await getInterfaces();
    setInterfaces(data);
  }

  return (
    <div>

      <h1 className="text-3xl font-bold mb-6">
        Network Interfaces
      </h1>

      <table className="w-full border">

        <thead>

          <tr>

            <th>Name</th>

            <th>Status</th>

            <th>MAC</th>

            <th>IP Address</th>

          </tr>

        </thead>

        <tbody>

          {interfaces.map((item) => (

            <tr key={item.name}>

              <td>{item.name}</td>

              <td>{item.state}</td>

              <td>{item.mac}</td>

              <td>

                {item.addresses
                  .map((a: any) => a.ip)
                  .join(", ")}

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}