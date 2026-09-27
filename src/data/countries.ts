export const countriesData = {
  US: {
    name: "United States",
    states: [
      { label: "California", value: "CA" },
      { label: "New York", value: "NY" },
      { label: "Texas", value: "TX" },
      { label: "Florida", value: "FL" },
      { label: "Illinois", value: "IL" },
      { label: "Washington", value: "WA" },
    ]
  },
  CA: {
    name: "Canada",
    states: [
      { label: "Ontario", value: "ON" },
      { label: "Quebec", value: "QC" },
      { label: "British Columbia", value: "BC" },
      { label: "Alberta", value: "AB" },
    ]
  },
  UK: {
    name: "United Kingdom",
    states: [
      { label: "England", value: "ENG" },
      { label: "Scotland", value: "SCT" },
      { label: "Wales", value: "WLS" },
      { label: "Northern Ireland", value: "NIR" },
    ]
  },
  AU: {
    name: "Australia",
    states: [
      { label: "New South Wales", value: "NSW" },
      { label: "Victoria", value: "VIC" },
      { label: "Queensland", value: "QLD" },
      { label: "Western Australia", value: "WA" },
    ]
  },
  PK: {
    name: "Pakistan",
    states: [
      { label: "Punjab", value: "PB" },
      { label: "Sindh", value: "SD" },
      { label: "Khyber Pakhtunkhwa", value: "KP" },
      { label: "Balochistan", value: "BA" },
      { label: "Islamabad Capital Territory", value: "ICT" },
      { label: "Gilgit-Baltistan", value: "GB" },
      { label: "Azad Kashmir", value: "AJK" }
    ]
  },
  UAE: {
    name: "United Arab Emirates",
    states: [
      { label: "Dubai", value: "DU" },
      { label: "Abu Dhabi", value: "AZ" },
      { label: "Sharjah", value: "SH" }
    ]
  }
};

export const countryOptions = Object.entries(countriesData).map(([code, data]) => ({
  label: data.name,
  value: code
}));
