

// Hide the cards while they are not in use
$("#location").toggle();
$("#weather").toggle();

// Getting and displaying day of the week
let weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

// Get and display the background image
let backgrounds = [
  "https://www.wallpaperup.com/uploads/wallpapers/2014/04/03/321171/4aa754d10fabd1388f93afe712936958-700.jpg",
  "https://source.unsplash.com/RmNAdoJNFJs",
  "https://wallpaperscave.com/images/original/18/06-03/earth-nature-trees-54082.jpg",
  "https://img1.goodfon.com/original/2048x1365/0/3b/wind-energy-sport.jpg",
  "https://source.unsplash.com/A6WQ57dzHgU"
];

// Show a background image according to temporal conditions
function weatherBackground(rain, clouds, wind, snow) {
  if (clouds > 50) {
    $("#backgroundWeather").css(
      "background-image",
      "url(" + backgrounds[1] + ")"
    );
  } else if (wind > 25) {
    $("#backgroundWeather").css(
      "background-image",
      "url(" + backgrounds[3] + ")"
    );
  } else {
    $("#backgroundWeather").css(
      "background-image",
      "url(" + backgrounds[4] + ")"
    );
  }
  try {
    if (snow["1h"] > 1)
      $("#backgroundWeather").css(
        "background-image",
        "url(" + backgrounds[2] + ")"
      );
  } catch (error) {
    console.log(error);
  }
  try {
    if (rain["1h"] > 1)
      $("#backgroundWeather").css(
        "background-image",
        "url(" + backgrounds[0] + ")"
      );
  } catch (error) {
    console.log(error);
  }
}

//---change de background color of the cards with the information respecto to the temperature--------

function setCardColor(degree) {
  $("#location").css("color", "white");
  $("#weather").css("color", "white");
  if (degree <= 60 && degree >= 30) {
    $("#location").css("backgroundColor", "#c26d6da1");
    $("#weather").css("backgroundColor", "#c26d6da1");
  } else if (degree <= 30 && degree >= 20) {
    $("#location").css("backgroundColor", "#dc8b44a1");
    $("#weather").css("backgroundColor", "#dc8b44a1");
  } else if (degree <= 20 && degree >= 10) {
    $("#location").css("backgroundColor", "#128a1ba1");
    $("#weather").css("backgroundColor", "#128a1ba1");
  } else if (degree <= 10 && degree >= 0) {
    $("#location").css("backgroundColor", "#2e7bcaa1");
    $("#weather").css("backgroundColor", "#2e7bcaa1");
  } else {
    $("#location").css("backgroundColor", "#ffffffa1");
    $("#weather").css("backgroundColor", "#ffffffa1");
    $("#location").css("color", "#1f1f1f");
    $("#weather").css("color", "#1f1f1f");
  }
}

//---------------------------------------------------animations -----------------------------------------------------

//--------------------------move leaves to left of screen, first parameter is wind speed-----------------------------

function leavesAnimation() {
  let duration = (50 / arguments[0]) * 1000;
  for (let i = 1; i < arguments.length + 1; i++) {
    let bottom = Math.floor(Math.random() * 80) + 10;
    let originBottom = Math.floor(Math.random() * 60) + 20;
    let originLeft = Math.floor(Math.random() * 4) * 10 - 10;
    $(arguments[i]).css({ bottom: originBottom + "%", left: originLeft + "%" });
    $(arguments[i]).animate(
      {
        bottom: bottom + "%",
        left: "100%"
      },
      {
        duration: duration,
        easing: "linear"
      }
    );
    $({ deg: 0, element: arguments[i] }).animate(
      {
        deg: 360
      },
      {
        duration: duration,
        easing: "linear",
        step: function(deg) {
          $(this.element).css("transform", "rotate(" + deg + "deg)");
        }
      }
    );
  }
}

//-----------------------------create snowflackes and move them down-------------------------------------------------

function snowAnimation(volume) {
  $("#snow").empty();
  while (volume > 0) {
    let left = Math.floor(Math.random() * 9) * 10;
    let top = Math.floor(Math.random() * 3) * 10 - 20;
    let src =
      Math.floor(Math.random() * 2) == 1
        ? "src/assets/snowFlake.png"
        : "src/assets/snowFlake2.png";
    $("#snow").append(
      $("<img>", { src: src, width: "5%" })
        .css({ top: top + "%", left: left + "%", position: "absolute" })
        .animate(
          {
            top: "100%"
          },
          (100 / 9.8) * 1000
        )
    );
    volume--;
  }
}
//--------------Clouds appear around the screen for cloudiness as first parameter-----------------------

function showClouds() {
  $("#cloud").empty();
  while (arguments[0] > 0) {
    let i = Math.floor(Math.random() * (arguments.length - 1)) + 1;
    let top = Math.floor(Math.random() * 5) * 10 + 10;
    let left = Math.floor(Math.random() * 9) * 10;
    arguments[0]--;
    console.log(i);
    $("#cloud").append(
      $("<img>", { src: arguments[i], alt: "cloud", width: "10%" }).css({
        position: "absolute",
        top: top + "%",
        left: left + "%",
        zIndex: "-1"
      })
    );
  }
}

//---------------Chande nav bakcground color respect to the hour in Date.getTime() seconds--------------
function changeNavColor(hour, sunrise, sunset) {
  console.log(hour + " " + sunrise + " " + sunset);
  if (hour > sunrise && hour < sunset) {
    console.log("a");
    $(".nav").css({ backgroundColor: "white", color: "black" });
  } else {
    console.log("b");
    $(".nav").css({ backgroundColor: "rgb(40,40,40)", color: "white" });
  }
}

//-------------------------Get coordinates and call getWeather(position) with them-----------------------

navigator.geolocation.getCurrentPosition(function(position) {
  getWeather(position);
});

//--------Get weather and some data of a place by its latitude and longitude in html elements------------

function getWeather(position) {
  $("#location").show();
  $("#weather").show();
  $.ajax({
    method: "get",
    url:
      "https://api.openweathermap.org/data/2.5/weather?lat=" +
      position.coords.latitude +
      "&lon=" +
      position.coords.longitude +
      "&appid=da4bcfb6b216a4d618074451c68031f2"
  })
    .done(function(data) {
      try {
        snowAnimation(data.snow["1h"] * 5);
      } catch (e) {}

      showClouds(
        data.clouds.all / 5,
        "src/assets/cloudSheep.png",
        "src/assets/heartCloud.png",
        "src/assets/cloud.png"
      );

      setCardColor((data.main.temp - 273.15).toFixed(0));

      weatherBackground(
        data.rain,
        data.clouds.all,
        data.wind.speed * 3.6,
        data.snow
      );

      printCard(
        (data.main.temp - 273.15).toFixed(0) + "ºC",
        data.rain,
        data.clouds.all,
        (data.wind.speed * 3.6).toFixed(2),
        data.snow
      );

      leavesAnimation(
        data.wind.speed,
        "#greenLeave",
        "#redLeave",
        "#coloredLeave",
        "#dandelionSeed"
      );

      weatherIcon(data.weather[0].icon);

      let localDate = new Date();
      let timeZone = data.timezone * 1000;
      let localZone = localDate.getTimezoneOffset() * 60000;
      let date = new Date(localDate.getTime() + timeZone + localZone);

      changeNavColor(date.getTime() / 1000, data.sys.sunrise, data.sys.sunset);

      $("#cityName").text(data.name);

      $("#sunset")
        .empty()
        .append($('<img class="sunset" src="src/assets/sunset.png">'))
        .append(
          "<div class='padding--left'>" +
            new Date(data.sys.sunset * 1000).toTimeString().substr(0, 5) +
            "</div>"
        );

      $("#sunrise")
        .empty()
        .append($('<img class="sunrise" src="src/assets/sunrise.png">'))
        .append(
          "<div class='padding--left'> " +
            new Date(data.sys.sunrise * 1000).toTimeString().substr(0, 5) +
            "</div>"
        );
      //$("#timeZone").text("GMT + ( " + data.timezone / 3600 + " )");
      $("#weekDay").text(weekDays[date.getDay() - 1]);
      $("#date").text(date.toUTCString().substring(0, 25));
    })
    .fail(function() {
      $("#error").text("Sorry... We have not found the city");
    });
}

//------------Get 3h 5 days weather predictions of a city in html elements, not working yet---------------

function getWeatherPrediction(city) {
  axios
    .get(
      "https://api.openweathermap.org/data/2.5/forecast?q=" +
        city +
        "&appid=da4bcfb6b216a4d618074451c68031f2"
    )
    .then(function(response) {
      console.log(response);
    })
    .catch(function(error) {
      alert(error);
    });
}

//-------------------Prevent default in the form submit and show the cards---------------------------------

$("#citySearch").submit(function() {
  event.preventDefault();
  $("#location").show();
  $("#weather").show();
});

//---------------Key down event to search the city in the API and show weather data in html----------------

$("#city").on("keydown", function() {
  if (event.key == "Enter") {
    var city = $("#city").val();

    if (city !== "") {
      $.ajax({
        method: "get",
        url:
          "https://api.openweathermap.org/data/2.5/weather?q=" +
          city +
          "&appid=da4bcfb6b216a4d618074451c68031f2"
      })

        .done(function(data) {
          try {
            snowAnimation(data.snow["1h"] * 5);
          } catch (e) {}

          showClouds(
            data.clouds.all / 5,
            "src/assets/cloudSheep.png",
            "src/assets/heartCloud.png",
            "src/assets/cloud.png"
          );

          setCardColor((data.main.temp - 273.15).toFixed(0));

          weatherBackground(
            data.rain,
            data.clouds.all,
            data.wind.speed * 3.6,
            data.snow
          );

          printCard(
            (data.main.temp - 273.15).toFixed(0) + "ºC",
            data.rain,
            data.clouds.all,
            (data.wind.speed * 3.6).toFixed(2),
            data.snow
          );

          leavesAnimation(
            data.wind.speed,
            "#greenLeave",
            "#redLeave",
            "#coloredLeave",
            "#dandelionSeed"
          );

          weatherIcon(data.weather[0].icon);

          let localDate = new Date();
          let timeZone = data.timezone * 1000;
          let localZone = localDate.getTimezoneOffset() * 60000;
          let date = new Date(localDate.getTime() + timeZone + localZone);

          changeNavColor(
            date.getTime() / 1000,
            data.sys.sunrise,
            data.sys.sunset
          );

          $("#cityName").text(data.name);

          $("#sunset")
            .empty()
            .append($('<img class="sunset" src="src/assets/sunset.png">'))
            .append(
              "<div class='padding--left'>" +
                new Date(data.sys.sunset * 1000).toTimeString().substr(0, 5) +
                "</div>"
            );

          $("#sunrise")
            .empty()
            .append($('<img class="sunrise" src="src/assets/sunrise.png">'))
            .append(
              "<div class='padding--left'> " +
                new Date(data.sys.sunrise * 1000).toTimeString().substr(0, 5) +
                "</div>"
            );
          //$("#timeZone").text("GMT + ( " + data.timezone / 3600 + " )");
          $("#weekDay").text(weekDays[date.getDay() - 1]);
          $("#date").text(date.toUTCString().substring(0, 25));
        })
        .fail(function() {
          $("#error").text("Sorry... We have not found the city");
        });
    } else {
      $("#error").html("Sorry... We have not found the city");
    }
  }
});

//----------------function to print the second card--------------

function printCard(degree, rain, clouds, wind, snow) {
  //---------------- Color temperature ------
  $("#degree").text(degree);
  $("#clouds").text("Cloudiness: " + clouds + "%");
  $("#wind").text("Wind speed: " + wind + "km/h");
  try {
    $("#rain").text("Rain volume: " + rain["1h"] + "mm");
  } catch (error) {
    $("#rain").html("");
  }
  try {
    $("#snow").text("Snow volume: " + snow["1h"] + "mm");
  } catch (error) {
    $("#snow").html("");
  }
}

function weatherIcon(id) {
  $("#icon").attr({
    width: "100px",
    src: "https://openweathermap.org/img/wn/" + id + ".png"
  });
}
