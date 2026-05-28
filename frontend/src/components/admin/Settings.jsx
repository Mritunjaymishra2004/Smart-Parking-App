import {
  useState,
} from "react";

import DashboardLayout from "../../components/common/DashboardLayout";

import api from "../../api/axios";


// ======================================================
// SETTINGS PAGE
// ======================================================

export default function Settings() {

  // ====================================================
  // PROFILE STATE
  // ====================================================

  const [profile, setProfile] =
    useState({

      full_name: "",

      email: "",

      phone: "",
    });


  // ====================================================
  // PASSWORD STATE
  // ====================================================

  const [passwords, setPasswords] =
    useState({

      old_password: "",

      new_password: "",

      confirm_password: "",
    });


  // ====================================================
  // NOTIFICATION STATE
  // ====================================================

  const [notifications, setNotifications] =
    useState({

      email_notifications: true,

      sms_notifications: false,

      push_notifications: true,
    });


  // ====================================================
  // HANDLE PROFILE CHANGE
  // ====================================================

  const handleProfileChange =
    (e) => {

      setProfile({

        ...profile,

        [e.target.name]:
          e.target.value,
      });
    };


  // ====================================================
  // HANDLE PASSWORD CHANGE
  // ====================================================

  const handlePasswordChange =
    (e) => {

      setPasswords({

        ...passwords,

        [e.target.name]:
          e.target.value,
      });
    };


  // ====================================================
  // SAVE PROFILE
  // ====================================================

  const saveProfile =
    async () => {

      try {

        await api.put(
          "/auth/profile/",
          profile
        );

        alert(
          "Profile updated successfully"
        );

      } catch (error) {

        console.error(
          "Profile update error:",
          error
        );
      }
    };


  // ====================================================
  // CHANGE PASSWORD
  // ====================================================

  const changePassword =
    async () => {

      if (
        passwords.new_password !==
        passwords.confirm_password
      ) {

        alert(
          "Passwords do not match"
        );

        return;
      }

      try {

        await api.post(
          "/auth/change-password/",
          passwords
        );

        alert(
          "Password updated successfully"
        );

        setPasswords({

          old_password: "",

          new_password: "",

          confirm_password: "",
        });

      } catch (error) {

        console.error(
          "Password change error:",
          error
        );
      }
    };


  // ====================================================
  // SAVE NOTIFICATION SETTINGS
  // ====================================================

  const saveNotifications =
    () => {

      alert(
        "Notification settings saved"
      );
    };


  // ====================================================
  // UI
  // ====================================================

  return (

    <DashboardLayout>

      {/* ========================================== */}
      {/* PAGE HEADER */}
      {/* ========================================== */}

      <div className="mb-8">

        <h1 className="
          text-3xl
          font-bold
          text-white
        ">
          Settings
        </h1>

        <p className="
          text-slate-400
          mt-1
        ">
          Manage your account
          and system settings
        </p>

      </div>


      {/* ========================================== */}
      {/* PROFILE SETTINGS */}
      {/* ========================================== */}

      <div className="
        bg-slate-900
        border
        border-slate-800
        rounded-2xl
        p-6
        mb-8
      ">

        <h2 className="
          text-xl
          font-semibold
          text-white
          mb-6
        ">
          Profile Settings
        </h2>

        <div className="
          grid
          grid-cols-1
          md:grid-cols-2
          gap-6
        ">

          {/* FULL NAME */}

          <div>

            <label className="
              block
              text-slate-300
              mb-2
            ">
              Full Name
            </label>

            <input
              type="text"
              name="full_name"
              value={profile.full_name}
              onChange={handleProfileChange}
              className="
                w-full
                bg-slate-800
                border
                border-slate-700
                text-white
                px-4
                py-3
                rounded-xl
                outline-none
              "
            />

          </div>


          {/* EMAIL */}

          <div>

            <label className="
              block
              text-slate-300
              mb-2
            ">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleProfileChange}
              className="
                w-full
                bg-slate-800
                border
                border-slate-700
                text-white
                px-4
                py-3
                rounded-xl
                outline-none
              "
            />

          </div>


          {/* PHONE */}

          <div>

            <label className="
              block
              text-slate-300
              mb-2
            ">
              Phone Number
            </label>

            <input
              type="text"
              name="phone"
              value={profile.phone}
              onChange={handleProfileChange}
              className="
                w-full
                bg-slate-800
                border
                border-slate-700
                text-white
                px-4
                py-3
                rounded-xl
                outline-none
              "
            />

          </div>

        </div>


        {/* SAVE BUTTON */}

        <button
          onClick={saveProfile}
          className="
            mt-6
            bg-blue-600
            hover:bg-blue-700
            text-white
            px-6
            py-3
            rounded-xl
          "
        >
          Save Profile
        </button>

      </div>


      {/* ========================================== */}
      {/* PASSWORD SETTINGS */}
      {/* ========================================== */}

      <div className="
        bg-slate-900
        border
        border-slate-800
        rounded-2xl
        p-6
        mb-8
      ">

        <h2 className="
          text-xl
          font-semibold
          text-white
          mb-6
        ">
          Change Password
        </h2>

        <div className="
          grid
          grid-cols-1
          md:grid-cols-2
          gap-6
        ">

          {/* OLD PASSWORD */}

          <div>

            <label className="
              block
              text-slate-300
              mb-2
            ">
              Old Password
            </label>

            <input
              type="password"
              name="old_password"
              value={passwords.old_password}
              onChange={handlePasswordChange}
              className="
                w-full
                bg-slate-800
                border
                border-slate-700
                text-white
                px-4
                py-3
                rounded-xl
                outline-none
              "
            />

          </div>


          {/* NEW PASSWORD */}

          <div>

            <label className="
              block
              text-slate-300
              mb-2
            ">
              New Password
            </label>

            <input
              type="password"
              name="new_password"
              value={passwords.new_password}
              onChange={handlePasswordChange}
              className="
                w-full
                bg-slate-800
                border
                border-slate-700
                text-white
                px-4
                py-3
                rounded-xl
                outline-none
              "
            />

          </div>


          {/* CONFIRM PASSWORD */}

          <div>

            <label className="
              block
              text-slate-300
              mb-2
            ">
              Confirm Password
            </label>

            <input
              type="password"
              name="confirm_password"
              value={passwords.confirm_password}
              onChange={handlePasswordChange}
              className="
                w-full
                bg-slate-800
                border
                border-slate-700
                text-white
                px-4
                py-3
                rounded-xl
                outline-none
              "
            />

          </div>

        </div>


        {/* CHANGE BUTTON */}

        <button
          onClick={changePassword}
          className="
            mt-6
            bg-emerald-600
            hover:bg-emerald-700
            text-white
            px-6
            py-3
            rounded-xl
          "
        >
          Update Password
        </button>

      </div>


      {/* ========================================== */}
      {/* NOTIFICATION SETTINGS */}
      {/* ========================================== */}

      <div className="
        bg-slate-900
        border
        border-slate-800
        rounded-2xl
        p-6
      ">

        <h2 className="
          text-xl
          font-semibold
          text-white
          mb-6
        ">
          Notifications
        </h2>


        {/* EMAIL */}

        <div className="
          flex
          items-center
          justify-between
          mb-4
        ">

          <span className="
            text-slate-300
          ">
            Email Notifications
          </span>

          <input
            type="checkbox"
            checked={
              notifications.email_notifications
            }
            onChange={() =>
              setNotifications({

                ...notifications,

                email_notifications:
                  !notifications.email_notifications,
              })
            }
          />

        </div>


        {/* SMS */}

        <div className="
          flex
          items-center
          justify-between
          mb-4
        ">

          <span className="
            text-slate-300
          ">
            SMS Notifications
          </span>

          <input
            type="checkbox"
            checked={
              notifications.sms_notifications
            }
            onChange={() =>
              setNotifications({

                ...notifications,

                sms_notifications:
                  !notifications.sms_notifications,
              })
            }
          />

        </div>


        {/* PUSH */}

        <div className="
          flex
          items-center
          justify-between
          mb-6
        ">

          <span className="
            text-slate-300
          ">
            Push Notifications
          </span>

          <input
            type="checkbox"
            checked={
              notifications.push_notifications
            }
            onChange={() =>
              setNotifications({

                ...notifications,

                push_notifications:
                  !notifications.push_notifications,
              })
            }
          />

        </div>


        {/* SAVE BUTTON */}

        <button
          onClick={saveNotifications}
          className="
            bg-purple-600
            hover:bg-purple-700
            text-white
            px-6
            py-3
            rounded-xl
          "
        >
          Save Notification Settings
        </button>

      </div>

    </DashboardLayout>
  );
}