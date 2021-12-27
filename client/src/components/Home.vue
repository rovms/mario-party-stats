<template>
  <div class="container">
    <div v-if="isLoading">AUF SERVER WARTEN . . .</div>
    <div v-if="!isLoading">
      <button v-if="!showNewResultForm" class="button primary results" @add-points="submitPoints" @abort="closeNewPointsForm" @click="showNewResultForm = true">
        RESULTATE &nbsp; ERFASSEN
      </button>
      <form v-if="showNewResultForm">
        <button class="button primary" @click="closeNewPointsForm()" type="button">Abbrechen</button>
        <button class="button success" @click="submitPoints()" type="button">Speichern</button>
        <div class="table-container">
          <table class="result-table">
            <tr v-for="player in players" :key="player">
              <td class="row-name">
                <div>{{ player.name }}</div>
              </td>
              <td class="row-points" style="padding: 0.3rem">
                <div class="scoreChange" @click="player.newPoints = player.newPoints <= 1 ? 0 : player.newPoints - 1">
                  <img class="scoreIcon" src="../assets/down.svg" alt="Down" />
                </div>
              </td>
              <td class="row-points">
                <div>{{ player.newPoints || 0 }}</div>
              </td>
              <td class="row-points">
                <div class="scoreChange" @click="player.newPoints < 7 ? player.newPoints++ : null">
                  <img class="scoreIcon" src="../assets/up.svg" alt="Up" />
                </div>
              </td>
            </tr>
          </table>
        </div>
      </form>
      <div class="chart-container">
        <canvas class="chart" ref="allTimeDevelopmentChart" width="200" height="200"></canvas>
        <canvas class="chart" ref="totalPerYearChart" width="200" height="200"></canvas>
      </div>
    </div>
    <div style="margin-top: 20px">
      <div v-if="selectedPlayer != null">
        <div class="info-text" style="font-size: 150%">{{ selectedPlayer.text }}</div>
        <img src="../assets/Joni.gif" alt="Joni" v-if="selectedPlayer.name === 'Joni'" style="width: 230px" />
        <img src="../assets/Michi.gif" alt="Michi" v-if="selectedPlayer.name === 'Michi'" style="width: 230px" />
        <img src="../assets/Tobi.gif" alt="Tobi" v-if="selectedPlayer.name === 'Tobi'" style="width: 230px" />
        <img src="../assets/Roemu.gif" alt="Roemu" v-if="selectedPlayer.name === 'Römu'" style="width: 230px" />
      </div>
      <div class="info-container">
        <div class="info-element" v-for="player in players" :key="player" @click="showImageAndText(player)">{{ player.name }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from "chart.js";
import axios from "axios";
import router from "../router";
import authHeader from "../auth";

const API_URL = "/api/";
const CHART_COLORS = [
  "rgba(255, 153, 51, 0.6)",
  "rgba(153, 51, 255, 0.6)",
  "rgba(51, 255, 153, 0.6)",
  "rgba(204, 204, 0, 0.6)",
  "rgba(0, 204, 204, 0.6)",
  "rgba(204, 0, 204, 0.6)",
];

export default {
  name: "Home",

  data() {
    return {
      isLoading: true,
      players: [],
      showNewResultForm: false,
      totalPerYearChart: null,
      allTimeDevelopmentChart: null,
      password: "",
      canPlayAudio: true,
      selectedPlayer: null,
    };
  },
  methods: {
    playerImage() {
      return "../assets/" + this.selectedPlayer.name + ".gif";
    },

    showImageAndText(player) {
      if (this.selectedPlayer == null) {
        this.selectedPlayer = player;

        setTimeout(() => {
          this.selectedPlayer = null;
        }, 4000);
      }
    },

    closeNewPointsForm() {
      this.players.map((player) => (player.newPoints = 0));
      this.showNewResultForm = false;
    },

    submitPoints() {
      const thisYear = new Date().getFullYear();
      const totalPerYearDatasets = this.totalPerYearChart.data.datasets;
      const _pointsThisYear = totalPerYearDatasets.find((ds) => ds.label == thisYear);
      if (_pointsThisYear == null) {
        const nrOfPreviousYears = totalPerYearDatasets.length;
        const newYearDataset = this.createNewYearDataset(thisYear, CHART_COLORS[nrOfPreviousYears]);
        newYearDataset["data"] = this.players.map((player) => player.newPoints);
        totalPerYearDatasets.push(newYearDataset);
      } else {
        const thisYearData = { ..._pointsThisYear };
        for (let i = 0; i < thisYearData.data.length; i++) {
          thisYearData.data[i] += this.players[i].newPoints;
        }
      }

      let i;
      for (i = 0; i < this.players.length; i++) {
        const currentSummed = this.allTimeDevelopmentChart.data.datasets[i].data;
        currentSummed.push(parseInt(currentSummed[currentSummed.length - 1], 10) + parseInt(this.players[i].newPoints, 10));
      }
      this.allTimeDevelopmentChart.data.labels.push(
        parseInt(this.allTimeDevelopmentChart.data.labels[this.allTimeDevelopmentChart.data.labels.length - 1]) + 1
      );
      this.totalPerYearChart.update();
      this.allTimeDevelopmentChart.update();
      this.showNewResultForm = !this.showNewResultForm;

      axios
        .post(API_URL + "player", this.players, authHeader())
        .then(() => {
          console.log("Players updated.");
          this.players.forEach((p) => {
            p.newPoints = 0;
          });
        })
        .catch((error) => {
          if (error && error.response) {
            if (error.response.status === 401) {
              router.push({ name: "Login" });
            }
            console.error(error.response);
          } else {
            console.log(error);
          }
        });
    },

    createtotalPerYearChart() {
      const ctx = this.$refs.totalPerYearChart;
      const labels = [];

      this.players.forEach((p) => {
        labels.push(p.name);
      });

      const years = [];
      let player;
      for (player of this.players) {
        let score;
        for (score of player.scores) {
          const year = new Date(score.date).getFullYear();
          if (!years.includes(year)) {
            years.push(year);
          }
          if (player[year]) {
            player[year] += score.amount;
          } else {
            player[year] = score.amount;
          }
        }
      }

      const datasets = [];
      for (let i = 0; i < years.length; i++) {
        const yearDataset = this.createNewYearDataset(years[i], CHART_COLORS[i]);
        yearDataset["data"] = this.players.map((player) => player[years[i]]);
        datasets.push(yearDataset);
      }

      datasets.sort((d1, d2) => {
        if (d1.label < d2.label) return -1;
        if (d1.label > d2.label) return 1;
        return 0;
      });

      this.totalPerYearChart = new Chart(ctx, {
        type: "bar",

        data: {
          labels: labels,
          datasets: datasets,
        },
        options: {
          responsive: true,
          title: {
            display: true,
            text: "Total",
          },
          scales: {
            xAxes: [
              {
                stacked: true,
              },
            ],
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
                stacked: true,
              },
            ],
          },
        },
      });
    },

    createallTimeDevelopmentChart() {
      const ctx = this.$refs.allTimeDevelopmentChart;
      const datasets = [];
      const length = this.players[0].points.length; // assuming that all players have the same amount of scores.

      const labels = Array.from({ length: length + 1 }, (_, index) => index);

      this.players.forEach((p) => {
        const summedPoints = [];
        summedPoints.push(0);
        let sum = 0;
        let score;
        for (score of p.scores) {
          sum = sum + score.amount;
          summedPoints.push(sum);
        }

        const dataset = {
          label: p.name,
          backgroundColor: p.color,
          borderColor: p.color,
          data: summedPoints,
          fill: false,
          borderWidth: 1,
        };

        datasets.push(dataset);
      });

      this.allTimeDevelopmentChart = new Chart(ctx, {
        type: "line",

        data: {
          labels: labels,
          datasets: datasets,
        },
        options: {
          legend: {
            onClick: function (e) {
              e.stopPropagation();
            },
            labels: {
              generateLabels: (chart) => {
                return chart.data.datasets.map((ds) => {
                  return {
                    text: ds.label,
                    fillStyle: ds.backgroundColor,
                    strokeStyle: "rgb(0,0,0)",
                    lineWidth: 1,
                  };
                });
              },
            },
          },
          responsive: true,
          title: {
            display: true,
            text: "Entwicklung",
          },
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          },
        },
      });
    },

    createNewYearDataset(label, backgroundColor) {
      return { label, backgroundColor, borderColors: "rgb(0, 0, 0)", borderWidth: 1 };
    },

    fetchPlayers() {
      axios
        .get(API_URL + "player", authHeader())
        .then((response) => {
          this.players = response.data;
          this.players.map((player) => {
            player.newPoints = 0;
          });
        })
        .then(() => {
          setTimeout(() => {
            this.isLoading = false;
          }, 50);
        })
        .catch((error) => {
          console.log(error);
          if (error && error.response && error.response.status === 401) {
            setTimeout(() => {
              router.push({ name: "Login" });
            }, 500);
          }
        });
    },

    retrieveData() {
      this.fetchPlayers();
      const MAX_WAIT_TIMES = 10;
      let waitedTimes = 0;
      const interval = setInterval(() => {
        if (this.isLoading) {
          if (waitedTimes >= MAX_WAIT_TIMES) {
            clearInterval(interval);
          }
          waitedTimes++;
        } else {
          this.createtotalPerYearChart();
          this.createallTimeDevelopmentChart();
          clearInterval(interval);
        }
      }, 200);
    },
  },

  created() {
    Chart.defaults.global.defaultFontSize = 12;
    Chart.defaults.global.title.fontSize = 16;

    this.retrieveData();
  },
};
</script>

<style scoped>
.full {
  flex: 0 0 100%;
  display: flex;
  justify-content: center;
}

/* The flip card container - set the width and height to whatever you want. We have added the border property to demonstrate that the flip itself goes out of the box on hover (remove perspective if you don't want the 3D effect */
.flip-card {
  background-color: transparent;
  width: 300px;
  height: 300px;
  border: 1px solid #f1f1f1;
  perspective: 1000px; /* Remove this if you don't want the 3D effect */
}

/* This container is needed to position the front and back side */
.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.8s;
  transform-style: preserve-3d;
}

/* Do an horizontal flip when you move the mouse over the flip box container */
.flip-card:hover .flip-card-inner {
  transform: rotateY(180deg);
}

/* Position the front and back side */
.flip-card-front,
.flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden; /* Safari */
  backface-visibility: hidden;
}

/* Style the front side (fallback if image is missing) */
.flip-card-front {
  background-color: #bbb;
  color: black;
}

/* Style the back side */
.flip-card-back {
  background-color: dodgerblue;
  color: white;
  transform: rotateY(180deg);
}
</style>
