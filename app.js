const container = document.querySelector(".container");
const live = document.querySelector("#live");
const europe = document.querySelector("#europe");
const asia = document.querySelector("#asia");
const africa = document.querySelector("#africa");
const americas = document.querySelector("#americas");
const oceania = document.querySelector("#oceania");
const world = document.querySelector("#world");
const buttonContainer = document.querySelector(".button-container");
let regions = ["Africa", "Americas", "Asia", "Europe", "Oceania"];
const continents = {};

const fetchData = async (url) => {
  try {
    const response = await axios.get(url);
  } catch (error) {
    console.log(error);
  }
};

const getRegions = async () => {
  let continent = [];
  for (let i = 0; i < regions.length; i++) {
    let region = axios.get(
      `https://restcountries.com/v3.1/region/${regions[i]}`
    );

    continent.push(region);
  }
  let data = Promise.all(continent).then((res) => {
    return res;
  });

  return data;
};

const getCountries = async () => {
  let fetchCountries = await getRegions();

  let countryNames = [];
  for (let i = 0; i < fetchCountries.length; i++) {
    let countryCall = fetchCountries[i].data;

    for (let extract of countryCall) {
      let { name, region, borders, cca3, flags, population, subregion } =
        extract;

      countryNames.push({
        name,
        region,
        borders,

        cca3,
        flags,
        population,
        subregion,
      });
    }
  }
  return countryNames;
};

const getCountriesApi = async () => {
  const fetchCountry = await axios.get(
    "https://countriesnow.space/api/v0.1/countries"
  );
  let countries = fetchCountry.data.data;
  let fetchedCountries = [];
  for (let country1 of countries) {
    // console.log(country);
    let { country, cities } = country1;
    fetchedCountries.push({ country, cities });
  }
  return fetchedCountries;
};

const getCitiesFromApi = async () => {
  let countries = await getCountriesApi();
  console.log(countries);
};
//   getCitiesFromApi()

const getDataOnPage = async (region) => {
  let countries = await getCountries();

  for (let i = 0; i < countries.length; i++) {
    if (countries[i].region == region) {
      const p = document.createElement("p");
      container.appendChild(p);
      //   p.textContent = countries[i].name.common;
    }
  }
};
getDataOnPage("Asia");
getDataOnPage("Africa");
getDataOnPage("Americas");
getDataOnPage("Europe");
getDataOnPage("Oceania");

const fetchCities = async (countryName) => {
  let res;
  try {
    res = await fetch(
      "https://countriesnow.space/api/v0.1/countries/population/cities/filter",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          limit: 10,
          order: "asc",
          orderBy: "name",
          country: `${countryName}`,
        }),
      }
    );
  } catch {
    (error) => console.log(error);
  }

  const data = await res.json();

  const cities = data.data.map((city) => {
    return {
      country: city.country,
      name: city.city,
      population: city.populationCounts[0].value,
    };
  });
  // console.log(cities);
  return cities;
};

const getRegionButtons = async (region) => {
  buttonContainer.replaceChildren([]);
  const countries = await getCountries();

  container.appendChild(buttonContainer);
  for (let country of countries) {
    if (country.region == region) {
      const button = document.createElement("button");
      buttonContainer.appendChild(button);
      button.textContent = country.name.common;
    } else {
    }
  }
};

const eventListeners = () => {
  //const buttonConitaner = document.querySelector("#button-container");

  africa.addEventListener("click", (e) => {
    if (e.target.id == "africa") {
      getRegionButtons("Africa");
      drawChart("Africa");
    }
  });
  americas.addEventListener("click", (e) => {
    if (e.target.id == "americas") {
      getRegionButtons("Americas");
      drawChart("Americas");
    }
  });
  asia.addEventListener("click", (e) => {
    if (e.target.id == "asia") {
      getRegionButtons("Asia");
      drawChart("Asia");
    }
  });

  europe.addEventListener("click", (e) => {
    if (e.target.id == "europe") {
      getRegionButtons("Europe");
      drawChart("Europe");
    }
  });
  oceania.addEventListener("click", (e) => {
    if (e.target.id == "oceania") {
      getRegionButtons("Oceania");
      drawChart("Oceania");
    }
  });
};

const getCityByCountryButton = async () => {
  const Conitaner = document.querySelector(".container");

  const countries = await getCountries();

  let countryArr = [];
  let regionArr = [];
  let cityCountry = [];

  Conitaner.addEventListener("click", async (e) => {
    if (e.target.tagName === "BUTTON") {
      const button = e.target;

      for (let i = 0; i < countries.length; i++) {
        console.log(countries[i]);
        countryArr.push(countries[i].name.common);
        regionArr.push(countries[i]);
      }

      for (let country of countryArr) {
        try {
          if (button.textContent == country) {
            const data = await fetchCities(country);

            for (let city of data) {
              let { country, name, population } = city;

              cityCountry.push({ country, name, population });
            }
          }
        } catch {
          (error) => console.log(error);
        }
      }
      cityCountry = cityCountry.filter(
        (value, index, self) =>
          index ===
          self.findIndex(
            (t) => t.country === value.country && t.name === value.name
          )
      );

      let currentCities = [];
      let currentPopulation = [];
      let currentBorders = [];
      for (let city of cityCountry) {
        let { name, country, population } = city;

        if (button.textContent == country) {
          currentCities.push(name);
          currentPopulation.push(population);
        }
      }

      let barChart = Chart.getChart("myChart");
      if (barChart != undefined) {
        barChart.destroy();
      }

      new Chart(document.getElementById("myChart").getContext("2d"), {
        type: "bar",
        data: {
          labels: currentCities,
          datasets: [
            {
              label: "Population",
              data: currentPopulation,
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(153, 102, 255, 0.2)",
                "rgba(255, 159, 64, 0.2)",
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }
  });
};

getCityByCountryButton();

eventListeners();

// DrawChart

let array = [];

const drawChart = async (str) => {
  const cityArray = await getCountries();
  let euArray = [];
  let euPopArray = [];

  let borderArray = [];

  for (let i = 0; i < cityArray.length; i++) {
    if (cityArray[i].region == str) {
      euArray.push(cityArray[i].name.common);
      euPopArray.push(cityArray[i].population);
      const tag = cityArray[i].cca3;
      const border = cityArray[i].borders;
      const name = cityArray[i].name.common;
      borderArray.push({ name, border, tag });
    }
  }

  let chartStatus = Chart.getChart("myChart");
  if (chartStatus != undefined) {
    chartStatus.destroy();
  }

  new Chart(document.getElementById("myChart").getContext("2d"), {
    type: "bar",
    data: {
      labels: euArray,
      datasets: [
        {
          label: "Population",
          data: euPopArray,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
};

/* const chart = new Chart(document.getElementById("bar-chart"), {
  type: "bar",
  data: {
    labels: ["Africa", "Asia", "Europe", "Latin America", "North America"],
    datasets: [
      {
        label: "Population (millions)",
        backgroundColor: [
          "#3e95cd",
          "#8e5ea2",
          "#3cba9f",
          "#e8c3b9",
          "#c45850",
        ],
        data: [2478, 5267, 734, 784, 433],
      },
    ],
  },
  options: {
    legend: { display: false },
    title: {
      display: true,
      text: "Predicted world population (millions) in 2050",
    },
  },
}); */
