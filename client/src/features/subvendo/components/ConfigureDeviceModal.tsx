import { useEffect, useState } from "react";
import { configureDevice } from "../services/subVendo.api";
import { getAssignableInterfaces } from "../../network/services/networkInterface.api";

interface Props {
  open: boolean;
  device: any;
  onClose: () => void;
}

export default function ConfigureDeviceModal({
  open,
  device,
  onClose,
}: Props) {

  const [form, setForm] = useState({
    machineName: "",

    parentInterface: "",

    vlanId: 100,

    ipMode: "STATIC",

    ipAddressStatic: "",

    subnetMask: "255.255.255.0",

    gateway: "",

    dns1: "8.8.8.8",

    dns2: "1.1.1.1",

    clientStartIp: 100,

    clientEndIp: 254,

    bandwidthProfile: "20 Mbps",

    portal: "Default",

    enabled: true,
  });

  const [
    interfaces,
    setInterfaces
  ] = useState<any[]>([]);


  /**
   * Load available network interfaces
   */
  useEffect(() => {

    if (!open) {
      return;
    }

    loadInterfaces();

  }, [open]);


  /**
   * Reset form when device changes
   */
  useEffect(() => {

    if (!device) {
      return;
    }

    setForm(prev => ({
      ...prev,

      machineName:
        device.machineName ||
        `SubVendo-${device.chipId}`,

      ipAddressStatic:
        device.ipAddressStatic ||
        device.ipAddress ||
        "",

      gateway:
        device.gateway ||
        "",

      subnetMask:
        device.subnetMask ||
        "255.255.255.0",

      parentInterface:
        device.parentInterface ||
        "",

      vlanId:
        device.vlanId ||
        100,

    }));

  }, [device]);


  if (!open) {
    return null;
  }


  /**
   * Save configuration
   */
  async function handleSave() {

    if (!device) {
      return;
    }


    if (!form.machineName.trim()) {

      alert(
        "SubVendo Name is required."
      );

      return;

    }


    if (!form.parentInterface) {

      alert(
        "Parent Interface is required."
      );

      return;

    }


    if (!form.ipAddressStatic) {

      alert(
        "Static IP Address is required."
      );

      return;

    }


    if (!form.gateway) {

      alert(
        "Gateway is required."
      );

      return;

    }


    try {

      const payload = {

        machineName:
          form.machineName,

        parentInterface:
          form.parentInterface,

        vlanId:
          form.vlanId,

        ipMode:
          form.ipMode,

        ipAddressStatic:
          form.ipAddressStatic,

        subnetMask:
          form.subnetMask,

        gateway:
          form.gateway,

        dns1:
          form.dns1,

        dns2:
          form.dns2,

        clientStartIp:
          form.clientStartIp,

        clientEndIp:
          form.clientEndIp,

        bandwidthProfile:
          form.bandwidthProfile,

        portal:
          form.portal,

        enabled:
          true,

      };


      console.log(
        "CONFIGURE SUBVENDO"
      );

      console.log(
        "Chip ID:",
        device.chipId
      );

      console.log(
        "Payload:",
        payload
      );


      /**
       * IMPORTANT:
       *
       * Chip ID ang identity
       * ng SubVendo.
       */
      await configureDevice(

        device.chipId,

        payload

      );


      alert(
        "SubVendo configured successfully."
      );


      onClose();


      /**
       * Reload page after
       * successful configuration.
       *
       * Temporary solution.
       */
      window.location.reload();


    } catch (err) {

      console.error(
        "Configure SubVendo error:",
        err
      );

      alert(
        "Unable to configure SubVendo."
      );

    }

  }


  /**
   * Load network interfaces
   */
  async function loadInterfaces() {

    try {

      const res =
        await getAssignableInterfaces();


      console.log(
        "Assignable interfaces:",
        res.data
      );


      setInterfaces(
        res.data
      );


      /**
       * Auto select first interface
       */
      if (
        res.data.length > 0
      ) {

        const iface =
          res.data[0];


        setForm(prev => ({

          ...prev,

          parentInterface:
            iface.name,

          vlanId:
            iface.vlanId ??
            100,

          gateway:
            iface.gateway ??
            "",

          subnetMask:
            iface.subnetMask ??
            "255.255.255.0",

        }));

      }


    } catch (err) {

      console.error(
        "Unable to load interfaces:",
        err
      );

    }

  }


  return (

    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl p-8 max-h-[90vh] overflow-y-auto">


        <div className="mb-6">

          <h2 className="text-2xl font-bold">

            Configure SubVendo

          </h2>


          <p className="text-sm text-gray-500 mt-1">

            Configure this SubVendo using its Chip ID.

          </p>

        </div>


        {/* Device Identity */}

        <div className="bg-gray-50 border rounded-lg p-4 mb-6">

          <div className="grid grid-cols-2 gap-4">

            <div>

              <label className="text-sm text-gray-500">

                Chip ID

              </label>

              <div className="font-semibold">

                {device?.chipId}

              </div>

            </div>


            <div>

              <label className="text-sm text-gray-500">

                MAC Address

              </label>

              <div className="font-semibold">

                {device?.macAddress}

              </div>

            </div>


            <div>

              <label className="text-sm text-gray-500">

                Current IP

              </label>

              <div className="font-semibold">

                {device?.ipAddress}

              </div>

            </div>


            <div>

              <label className="text-sm text-gray-500">

                Firmware

              </label>

              <div className="font-semibold">

                {device?.firmwareVersion}

              </div>

            </div>

          </div>

        </div>


        {/* Configuration */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">


          {/* SubVendo Name */}

          <div>

            <label className="block text-sm font-medium">

              SubVendo Name

            </label>

            <input

              className="w-full border rounded-lg p-2 mt-1"

              value={
                form.machineName
              }

              onChange={e =>
                setForm({

                  ...form,

                  machineName:
                    e.target.value,

                })
              }

              placeholder="Example: SubVendo-01"

            />

          </div>


          {/* Parent Interface */}

          <div>

            <label className="block text-sm font-medium">

              Parent Interface

            </label>

            <select

              className="w-full border rounded-lg p-2 mt-1"

              value={
                form.parentInterface
              }

              onChange={e => {

                const iface =
                  interfaces.find(

                    (i: any) =>
                      i.name ===
                      e.target.value

                  );


                if (!iface) {
                  return;
                }


                setForm(prev => ({

                  ...prev,

                  parentInterface:
                    iface.name,

                  vlanId:
                    iface.vlanId ??
                    100,

                  gateway:
                    iface.gateway ??
                    "",

                  subnetMask:
                    iface.subnetMask ??
                    "255.255.255.0",

                }));

              }}

            >

              <option value="">

                Select Interface

              </option>


              {interfaces.map(

                (iface: any) => (

                  <option

                    key={
                      iface.id
                    }

                    value={
                      iface.name
                    }

                  >

                    {iface.displayName}

                  </option>

                )

              )}

            </select>

          </div>


          {/* VLAN */}

          <div>

            <label className="block text-sm font-medium">

              VLAN ID

            </label>

            <input

              type="number"

              className="w-full border rounded-lg p-2 mt-1"

              value={
                form.vlanId
              }

              onChange={e =>

                setForm({

                  ...form,

                  vlanId:
                    Number(
                      e.target.value
                    ),

                })

              }

            />

          </div>


          {/* IP Mode */}

          <div>

            <label className="block text-sm font-medium">

              IP Mode

            </label>

            <select

              className="w-full border rounded-lg p-2 mt-1"

              value={
                form.ipMode
              }

              onChange={e =>

                setForm({

                  ...form,

                  ipMode:
                    e.target.value,

                })

              }

            >

              <option value="STATIC">

                STATIC

              </option>

              <option value="DHCP">

                DHCP

              </option>

            </select>

          </div>


          {/* Static IP */}

          <div>

            <label className="block text-sm font-medium">

              SubVendo Static IP

            </label>

            <input

              className="w-full border rounded-lg p-2 mt-1"

              value={
                form.ipAddressStatic
              }

              onChange={e =>

                setForm({

                  ...form,

                  ipAddressStatic:
                    e.target.value,

                })

              }

              placeholder="10.0.0.10"

            />

          </div>


          {/* Gateway */}

          <div>

            <label className="block text-sm font-medium">

              Gateway

            </label>

            <input

              className="w-full border rounded-lg p-2 mt-1"

              value={
                form.gateway
              }

              onChange={e =>

                setForm({

                  ...form,

                  gateway:
                    e.target.value,

                })

              }

            />

          </div>


          {/* Subnet */}

          <div>

            <label className="block text-sm font-medium">

              Subnet Mask

            </label>

            <input

              className="w-full border rounded-lg p-2 mt-1"

              value={
                form.subnetMask
              }

              onChange={e =>

                setForm({

                  ...form,

                  subnetMask:
                    e.target.value,

                })

              }

            />

          </div>


          {/* DNS 1 */}

          <div>

            <label className="block text-sm font-medium">

              DNS 1

            </label>

            <input

              className="w-full border rounded-lg p-2 mt-1"

              value={
                form.dns1
              }

              onChange={e =>

                setForm({

                  ...form,

                  dns1:
                    e.target.value,

                })

              }

            />

          </div>


          {/* DNS 2 */}

          <div>

            <label className="block text-sm font-medium">

              DNS 2

            </label>

            <input

              className="w-full border rounded-lg p-2 mt-1"

              value={
                form.dns2
              }

              onChange={e =>

                setForm({

                  ...form,

                  dns2:
                    e.target.value,

                })

              }

            />

          </div>


          {/* Client Start */}

          <div>

            <label className="block text-sm font-medium">

              Client Start IP

            </label>

            <input

              type="number"

              className="w-full border rounded-lg p-2 mt-1"

              value={
                form.clientStartIp
              }

              onChange={e =>

                setForm({

                  ...form,

                  clientStartIp:
                    Number(
                      e.target.value
                    ),

                })

              }

            />

          </div>


          {/* Client End */}

          <div>

            <label className="block text-sm font-medium">

              Client End IP

            </label>

            <input

              type="number"

              className="w-full border rounded-lg p-2 mt-1"

              value={
                form.clientEndIp
              }

              onChange={e =>

                setForm({

                  ...form,

                  clientEndIp:
                    Number(
                      e.target.value
                    ),

                })

              }

            />

          </div>


          {/* Bandwidth */}

          <div>

            <label className="block text-sm font-medium">

              Bandwidth Profile

            </label>

            <input

              className="w-full border rounded-lg p-2 mt-1"

              value={
                form.bandwidthProfile
              }

              onChange={e =>

                setForm({

                  ...form,

                  bandwidthProfile:
                    e.target.value,

                })

              }

            />

          </div>


          {/* Portal */}

          <div>

            <label className="block text-sm font-medium">

              Portal

            </label>

            <select

              className="w-full border rounded-lg p-2 mt-1"

              value={
                form.portal
              }

              onChange={e =>

                setForm({

                  ...form,

                  portal:
                    e.target.value,

                })

              }

            >

              <option value="Default">

                Default

              </option>

            </select>

          </div>


        </div>


        {/* Buttons */}

        <div className="flex justify-end gap-3 mt-8">

          <button

            onClick={
              onClose
            }

            className="px-5 py-2 rounded-lg border"

          >

            Cancel

          </button>


          <button

            onClick={
              handleSave
            }

            className="px-5 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700"

          >

            Save & Approve

          </button>

        </div>


      </div>

    </div>

  );

}