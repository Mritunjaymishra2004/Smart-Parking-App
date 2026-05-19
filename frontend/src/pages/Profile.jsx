import {
  useState,
  useMemo,
} from "react";

import {
  User,
  Mail,
  Shield,
  MapPin,
  Phone,
  Camera,
  Car,
  Clock,
  LogOut,
  ArrowRightLeft,
  Save,
  Activity,
} from "lucide-react";

import {
  useAuth,
} from "../context/AuthContext";

import Login
from "./auth/Login";

import Signup
from "./auth/Signup";

import DashboardBackground
from "../components/common/DashboardBackground";

import Navbar
from "../components/common/Navbar";


// ======================================================
// PROFILE ROW
// ======================================================

function ProfileRow({

  icon,

  label,

  value,

  badge,

}) {

  return (

    <div className="
      flex
      items-center
      justify-between

      gap-4

      py-4

      border-b
      border-slate-800
    ">

      {/* LEFT */}

      <div className="
        flex
        items-center
        gap-3
      ">

        <div className="
          w-10
          h-10

          rounded-xl

          bg-slate-800

          flex
          items-center
          justify-center

          text-emerald-400
        ">

          {icon}

        </div>

        <div>

          <p className="
            text-slate-400
            text-sm
          ">

            {label}

          </p>

          <p className="
            text-white
            font-medium
          ">

            {value}

          </p>

        </div>

      </div>


      {/* BADGE */}

      {badge && (

        <div className={`
          px-3
          py-1

          rounded-full

          text-xs
          font-medium

          ${
            badge === "admin"

              ? `
                bg-purple-500/10
                text-purple-400
              `

              : `
                bg-blue-500/10
                text-blue-400
              `
          }
        `}>

          {badge}

        </div>
      )}

    </div>
  );
}


// ======================================================
// STAT CARD
// ======================================================

function StatCard({

  icon,

  label,

  value,

}) {

  return (

    <div className="
      bg-slate-900

      border
      border-slate-800

      rounded-3xl

      p-5

      flex
      items-center
      gap-4
    ">

      <div className="
        w-14
        h-14

        rounded-2xl

        bg-emerald-500/10

        flex
        items-center
        justify-center

        text-emerald-400
      ">

        {icon}

      </div>

      <div>

        <p className="
          text-slate-400
          text-sm
        ">

          {label}

        </p>

        <h3 className="
          text-2xl
          font-bold
          text-white
        ">

          {value}

        </h3>

      </div>

    </div>
  );
}


// ======================================================
// PROFILE
// ======================================================

export default function Profile() {

  const {

    user,

    viewRole,

    logout,

    switchRole,

  } = useAuth();

  const [mode,
    setMode] =
    useState("login");

  const [saving,
    setSaving] =
    useState(false);

  const [profile,
    setProfile] =
    useState({

      phone: "",

      address: "",

      city: "",

      photo: "",

      bio: "",
    });


  // ====================================================
  // PHOTO UPLOAD
  // ====================================================

  const handlePhotoChange =
    (e) => {

      const file =
        e.target.files[0];

      if (!file) {

        return;
      }

      const preview =
        URL.createObjectURL(file);

      setProfile({

        ...profile,

        photo: preview,
      });
    };


  // ====================================================
  // SAVE PROFILE
  // ====================================================

  const saveProfile =
    async () => {

      try {

        setSaving(true);

        // ==========================================
        // FUTURE API
        // ==========================================

        // await api.put("/profile/", profile)

        setTimeout(() => {

          alert(
            "Profile updated successfully"
          );

          setSaving(false);

        }, 1000);

      } catch (error) {

        console.error(error);

        setSaving(false);
      }
    };


  // ====================================================
  // USER STATS
  // ====================================================

  const stats =
    useMemo(() => [

      {
        label: "Vehicles",

        value: 2,

        icon: <Car size={24} />,
      },

      {
        label: "Bookings",

        value: 18,

        icon: <Clock size={24} />,
      },

      {
        label: "Activity",

        value: "High",

        icon: <Activity size={24} />,
      },

    ], []);


  // ====================================================
  // NOT LOGGED IN
  // ====================================================

  if (!user) {

    return (

      <DashboardBackground>

        <div className="
          min-h-screen

          flex
          items-center
          justify-center

          px-4
        ">

          <div className="
            bg-slate-900

            border
            border-slate-800

            rounded-3xl

            p-8

            w-full
            max-w-md
          ">

            {/* TABS */}

            <div className="
              flex
              gap-3

              mb-6
            ">

              <button

                onClick={() =>
                  setMode("login")
                }

                className={`
                  flex-1

                  py-3

                  rounded-2xl

                  font-medium

                  transition-all

                  ${
                    mode === "login"

                      ? `
                        bg-emerald-500
                        text-black
                      `

                      : `
                        bg-slate-800
                        text-white
                      `
                  }
                `}
              >

                Login

              </button>


              <button

                onClick={() =>
                  setMode("signup")
                }

                className={`
                  flex-1

                  py-3

                  rounded-2xl

                  font-medium

                  transition-all

                  ${
                    mode === "signup"

                      ? `
                        bg-emerald-500
                        text-black
                      `

                      : `
                        bg-slate-800
                        text-white
                      `
                  }
                `}
              >

                Signup

              </button>

            </div>


            {mode === "login"

              ? <Login embedded />

              : <Signup embedded />
            }

          </div>

        </div>

      </DashboardBackground>
    );
  }


  // ====================================================
  // UI
  // ====================================================

  return (

    <>
      <Navbar />

      <DashboardBackground>

        <div className="
          min-h-screen

          px-4
          py-10

          text-white
        ">

          <div className="
            max-w-7xl
            mx-auto

            space-y-8
          ">

            {/* ====================================== */}
            {/* HEADER */}
            {/* ====================================== */}

            <div className="
              flex
              flex-col
              xl:flex-row

              gap-8
            ">

              {/* PROFILE CARD */}

              <div className="
                xl:w-[380px]

                bg-slate-900

                border
                border-slate-800

                rounded-3xl

                p-8
              ">

                {/* PHOTO */}

                <div className="
                  flex
                  flex-col
                  items-center
                ">

                  <div className="
                    relative
                  ">

                    <img

                      src={
                        profile.photo

                        ||

                        "/default-user.png"
                      }

                      alt="Profile"

                      className="
                        w-32
                        h-32

                        rounded-full

                        object-cover

                        border-4
                        border-emerald-500/20
                      "
                    />

                    <label className="
                      absolute
                      bottom-1
                      right-1

                      w-10
                      h-10

                      rounded-full

                      bg-emerald-500

                      flex
                      items-center
                      justify-center

                      cursor-pointer

                      text-black
                    ">

                      <Camera size={18} />

                      <input

                        type="file"

                        hidden

                        onChange={
                          handlePhotoChange
                        }

                      />

                    </label>

                  </div>


                  {/* USER */}

                  <h2 className="
                    text-2xl
                    font-bold

                    mt-5
                  ">

                    {user.username}

                  </h2>

                  <p className="
                    text-slate-400
                    mt-1
                  ">

                    {user.email}

                  </p>


                  {/* ROLE */}

                  <div className="
                    mt-4

                    px-4
                    py-2

                    rounded-full

                    bg-emerald-500/10

                    text-emerald-400

                    text-sm
                    font-medium

                    capitalize
                  ">

                    {viewRole}

                  </div>

                </div>


                {/* ACTIONS */}

                <div className="
                  mt-8
                  space-y-3
                ">

                  {/* SWITCH ROLE */}

                  {user.role === "admin" && (

                    <button

                      onClick={() =>

                        switchRole(

                          viewRole === "admin"

                            ? "user"

                            : "admin"
                        )
                      }

                      className="
                        w-full

                        flex
                        items-center
                        justify-center
                        gap-2

                        py-3

                        rounded-2xl

                        bg-indigo-500/10

                        text-indigo-400

                        hover:bg-indigo-500/20

                        transition-all
                      "
                    >

                      <ArrowRightLeft
                        size={18}
                      />

                      Switch to {

                        viewRole === "admin"

                          ? "User"

                          : "Admin"
                      }

                    </button>
                  )}


                  {/* LOGOUT */}

                  <button

                    onClick={logout}

                    className="
                      w-full

                      flex
                      items-center
                      justify-center
                      gap-2

                      py-3

                      rounded-2xl

                      bg-red-500/10

                      text-red-400

                      hover:bg-red-500/20

                      transition-all
                    "
                  >

                    <LogOut size={18} />

                    Logout

                  </button>

                </div>

              </div>


              {/* ==================================== */}
              {/* RIGHT */}
              {/* ==================================== */}

              <div className="
                flex-1

                space-y-8
              ">

                {/* STATS */}

                <div className="
                  grid
                  grid-cols-1
                  md:grid-cols-3
                  gap-5
                ">

                  {stats.map((item) => (

                    <StatCard

                      key={item.label}

                      icon={item.icon}

                      label={item.label}

                      value={item.value}

                    />

                  ))}

                </div>


                {/* DETAILS */}

                <div className="
                  bg-slate-900

                  border
                  border-slate-800

                  rounded-3xl

                  p-8
                ">

                  <div className="
                    flex
                    items-center
                    gap-3

                    mb-8
                  ">

                    <User
                      size={26}
                      className="
                        text-emerald-400
                      "
                    />

                    <h2 className="
                      text-2xl
                      font-bold
                    ">

                      Account Details

                    </h2>

                  </div>


                  {/* PROFILE ROWS */}

                  <div>

                    <ProfileRow

                      icon={
                        <User size={18} />
                      }

                      label="Username"

                      value={user.username}

                    />

                    <ProfileRow

                      icon={
                        <Mail size={18} />
                      }

                      label="Email"

                      value={user.email}

                    />

                    <ProfileRow

                      icon={
                        <Shield size={18} />
                      }

                      label="Actual Role"

                      value={user.role}

                      badge={user.role}

                    />

                    <ProfileRow

                      icon={
                        <Shield size={18} />
                      }

                      label="Current View"

                      value={viewRole}

                      badge={viewRole}

                    />

                  </div>

                </div>


                {/* EDIT PROFILE */}

                <div className="
                  bg-slate-900

                  border
                  border-slate-800

                  rounded-3xl

                  p-8
                ">

                  <h2 className="
                    text-2xl
                    font-bold

                    mb-8
                  ">

                    Edit Profile

                  </h2>


                  <div className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    gap-5
                  ">

                    {/* PHONE */}

                    <div>

                      <label className="
                        text-sm
                        text-slate-400
                      ">

                        Phone Number

                      </label>

                      <div className="
                        relative
                        mt-2
                      ">

                        <Phone
                          size={18}
                          className="
                            absolute
                            left-4
                            top-1/2
                            -translate-y-1/2

                            text-slate-500
                          "
                        />

                        <input

                          value={profile.phone}

                          onChange={(e) =>

                            setProfile({

                              ...profile,

                              phone:
                                e.target.value,
                            })
                          }

                          className="
                            w-full

                            bg-slate-800

                            border
                            border-slate-700

                            rounded-2xl

                            pl-11
                            pr-4
                            py-3

                            text-white

                            outline-none

                            focus:border-emerald-500/30
                          "
                        />

                      </div>

                    </div>


                    {/* CITY */}

                    <div>

                      <label className="
                        text-sm
                        text-slate-400
                      ">

                        City

                      </label>

                      <div className="
                        relative
                        mt-2
                      ">

                        <MapPin
                          size={18}
                          className="
                            absolute
                            left-4
                            top-1/2
                            -translate-y-1/2

                            text-slate-500
                          "
                        />

                        <input

                          value={profile.city}

                          onChange={(e) =>

                            setProfile({

                              ...profile,

                              city:
                                e.target.value,
                            })
                          }

                          className="
                            w-full

                            bg-slate-800

                            border
                            border-slate-700

                            rounded-2xl

                            pl-11
                            pr-4
                            py-3

                            text-white

                            outline-none

                            focus:border-emerald-500/30
                          "
                        />

                      </div>

                    </div>

                  </div>


                  {/* ADDRESS */}

                  <div className="
                    mt-5
                  ">

                    <label className="
                      text-sm
                      text-slate-400
                    ">

                      Address

                    </label>

                    <textarea

                      rows={4}

                      value={profile.address}

                      onChange={(e) =>

                        setProfile({

                          ...profile,

                          address:
                            e.target.value,
                        })
                      }

                      className="
                        w-full

                        mt-2

                        bg-slate-800

                        border
                        border-slate-700

                        rounded-2xl

                        px-4
                        py-3

                        text-white

                        outline-none

                        resize-none

                        focus:border-emerald-500/30
                      "
                    />

                  </div>


                  {/* BIO */}

                  <div className="
                    mt-5
                  ">

                    <label className="
                      text-sm
                      text-slate-400
                    ">

                      Bio

                    </label>

                    <textarea

                      rows={3}

                      value={profile.bio}

                      onChange={(e) =>

                        setProfile({

                          ...profile,

                          bio:
                            e.target.value,
                        })
                      }

                      className="
                        w-full

                        mt-2

                        bg-slate-800

                        border
                        border-slate-700

                        rounded-2xl

                        px-4
                        py-3

                        text-white

                        outline-none

                        resize-none

                        focus:border-emerald-500/30
                      "
                    />

                  </div>


                  {/* SAVE */}

                  <button

                    onClick={saveProfile}

                    disabled={saving}

                    className="
                      mt-8

                      inline-flex
                      items-center
                      gap-2

                      px-6
                      py-3

                      rounded-2xl

                      bg-emerald-500

                      text-black
                      font-semibold

                      hover:bg-emerald-400

                      transition-all
                    "
                  >

                    <Save size={18} />

                    {
                      saving

                        ? "Saving..."

                        : "Save Changes"
                    }

                  </button>

                </div>

              </div>

            </div>

          </div>

        </div>

      </DashboardBackground>

    </>
  );
}