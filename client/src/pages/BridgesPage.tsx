import { useEffect, useState } from "react";
import {
    Plus,
    Trash2
} from "lucide-react";

import {
    getBridges,
    deleteBridge
} from "../services/bridge.api";

export default function BridgesPage() {

    const [bridges, setBridges] = useState<any[]>([]);

    async function load() {

        const res = await getBridges();

        setBridges(res.data);

    }

    useEffect(() => {

        load();

    }, []);

    return (

        <div className="space-y-6">

            <div className="flex justify-between">

                <div>

                    <h1 className="text-3xl font-bold">
                        Bridges
                    </h1>

                    <p className="text-gray-500">

                        Linux Bridge Configuration

                    </p>

                </div>

                <button
                    className="bg-sky-600 text-white rounded-lg px-5 py-3 flex gap-2"
                >

                    <Plus size={18}/>

                    Add Bridge

                </button>

            </div>

            <div className="bg-white rounded-xl shadow border overflow-hidden">

                <table className="w-full">

                    <thead>

                        <tr>

                            <th>Name</th>

                            <th>Status</th>

                            <th></th>

                        </tr>

                    </thead>

                    <tbody>

                        {bridges.map(item=>(

                            <tr key={item.id}>

                                <td>

                                    {item.name}

                                </td>

                                <td>

                                    {item.enabled
                                        ? "Running"
                                        : "Disabled"}

                                </td>

                                <td>

                                    <button>

                                        <Trash2/>

                                    </button>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>

    );

}