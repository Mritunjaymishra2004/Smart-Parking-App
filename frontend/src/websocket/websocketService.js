let pollingInterval = null;


// =====================================================
// API BASE URL
// =====================================================

const API_BASE_URL =
  "https://smart-parking-app-4on2.vercel.app/api/v1";


// =====================================================
// FETCH PARKING SLOT DATA
// =====================================================

const fetchParkingData = async (onMessage) => {

  try {

    const response = await fetch(
      `${API_BASE_URL}/slots/`
    );

    if (!response.ok) {

      throw new Error(
        `HTTP Error: ${response.status}`
      );
    }

    const data = await response.json();

    console.log(
      "Parking Data:",
      data
    );

    onMessage?.(data);

  } catch (err) {

    console.error(
      "Polling Error:",
      err
    );
  }
};


// =====================================================
// START POLLING
// =====================================================

export const connectWebSocket = (onMessage) => {

  console.log(
    "Polling started"
  );

  fetchParkingData(onMessage);

  pollingInterval = setInterval(() => {

    fetchParkingData(onMessage);

  }, 5000);
};


// =====================================================
// STOP POLLING
// =====================================================

export const disconnectWebSocket = () => {

  clearInterval(
    pollingInterval
  );

  pollingInterval = null;

  console.log(
    "Polling stopped"
  );
};