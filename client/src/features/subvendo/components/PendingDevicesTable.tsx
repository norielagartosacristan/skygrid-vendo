import { useEffect, useState } from "react";
import {
  getPendingDevices
} from "../services/subVendo.api";

import ConfigureDeviceModal
  from "./ConfigureDeviceModal";


export default function PendingDevicesTable() {

  const [
    devices,
    setDevices
  ] = useState<any[]>([]);


  const [
    selectedDevice,
    setSelectedDevice
  ] = useState<any>(null);


  const [
    openModal,
    setOpenModal
  ] = useState(false);


  async function loadDevices() {

    try {

      const res =
        await getPendingDevices();

      setDevices(
        res.data
      );

    } catch (err) {

      console.error(
        err
      );

    }

  }


  useEffect(() => {

    loadDevices();

    const interval =
      setInterval(

        loadDevices,

        10000

      );


    return () =>
      clearInterval(
        interval
      );

  }, []);


  return (

    <div className="bg-white rounded-xl shadow border overflow-hidden">

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-4 text-left">
                Chip ID
              </th>

              <th className="p-4 text-left">
                IP Address
              </th>

              <th className="p-4 text-left">
                MAC Address
              </th>

              <th className="p-4 text-left">
                Firmware
              </th>

              <th className="p-4 text-left">
                Online
              </th>

              <th className="p-4 text-center">
                Action
              </th>

            </tr>

          </thead>


          <tbody>

            {devices.map(
              device => (

                <tr
                  key={
                    device.chipId
                  }
                  className="border-t"
                >

                  <td className="p-4">

                    <div className="font-semibold">

                      {device.chipId}

                    </div>

                  </td>


                  <td className="p-4">

                    {device.ipAddress}

                  </td>


                  <td className="p-4">

                    {device.macAddress}

                  </td>


                  <td className="p-4">

                    {device.firmwareVersion}

                  </td>


                  <td className="p-4">

                    {device.online ? (

                      <span className="px-2 py-1 rounded bg-green-100 text-green-700">

                        Online

                      </span>

                    ) : (

                      <span className="px-2 py-1 rounded bg-gray-100 text-gray-500">

                        Offline

                      </span>

                    )}

                  </td>


                  <td className="p-4 text-center">

                    <button

                      onClick={() => {

                        setSelectedDevice(
                          device
                        );

                        setOpenModal(
                          true
                        );

                      }}

                      className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700"

                    >

                      Configure

                    </button>

                  </td>

                </tr>

              )
            )}


            {devices.length === 0 && (

              <tr>

                <td
                  colSpan={6}
                  className="text-center p-10 text-gray-500"
                >

                  No pending SubVendo devices found.

                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>


      <ConfigureDeviceModal

        open={
          openModal
        }

        device={
          selectedDevice
        }

        onClose={() => {

          setOpenModal(
            false
          );

          setSelectedDevice(
            null
          );

        }}

      />

    </div>

  );

}