import React from "react";


// ======================================================
// ERROR BOUNDARY
// ======================================================

class ErrorBoundary
extends React.Component {

  constructor(props) {

    super(props);

    this.state = {

      hasError: false,
    };
  }

  static getDerivedStateFromError() {

    return {

      hasError: true,
    };
  }

  componentDidCatch(

    error,

    errorInfo

  ) {

    console.error(
      "Application Error:",
      error,
      errorInfo
    );
  }

  render() {

    if (
      this.state.hasError
    ) {

      return (

        <div className="
          min-h-screen

          flex
          items-center
          justify-center

          bg-slate-950

          p-6
        ">

          <div className="
            text-center
            max-w-lg
          ">

            <h1 className="
              text-5xl
              font-bold

              text-red-400
            ">

              Something Went Wrong

            </h1>

            <p className="
              text-slate-400

              mt-4
            ">

              Smart Parking System
              encountered an error.

            </p>

            <button

              onClick={() =>
                window.location.reload()
              }

              className="
                mt-8

                px-6
                py-3

                rounded-xl

                bg-emerald-500

                text-black
                font-semibold
              "
            >

              Reload Application

            </button>

          </div>

        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;