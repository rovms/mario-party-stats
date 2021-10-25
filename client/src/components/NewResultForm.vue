<template>
  <form>
    <button class="button primary" @abort="$emit('onAbort')" type="button">Abbrechen</button>
    <!-- <button class="button success" @click="onSubmit">Speichern</button> -->
    <button class="button success" @click="$emit('addPoints')">Speichern</button>
    <div class="outer-container">
      <table class="result-table">
        <tr v-for="player in players" :key="player">
          <td class="row-name">{{ player.name }}</td>
          <td class="row-points" style="padding: 0.3rem">
            <button class="round" type="button" @click="player.newPoints = player.newPoints <= 1 ? 0 : player.newPoints - 1">-</button>
          </td>
          <td class="row-points">
            <div>{{ player.newPoints || 0 }}</div>
          </td>
          <td class="row-points"><button class="round" type="button" @click="player.newPoints++">+</button></td>
        </tr>
      </table>
    </div>
  </form>
</template>

<script>
export default {
  name: "NewResultForm",
  props: {
    players: Array,
  },
  emits: ["addPoints"],

  metdods: {
    hello() {
      console.log("sdfkjhdsf");
    },

    onSubmit(evt) {
      console.log("hello");
      console.log(evt);
      // evt.preventDefault();
      const pointsPerPlayer = [];
      this.players.forEach((p) => {
        pointsPerPlayer.push({
          playerId: p._id,
          newPoints: p.newPoints || 0,
        });
      });
      console.log(pointsPerPlayer);
      this.$parent.addPoints(pointsPerPlayer);
    },

    waaaaa() {
      console.log("waaa");
    },
  },
};
</script>

<style scoped>
.outer-container {
  display: flex;
  justify-content: space-evenly;
}

.inner-container {
  display: flex;
  margin: 3px;
}

.label {
  margin-right: 5px;
}

.sbutton {
  margin-top: 10px;
  color: greenyellow;
  background-color: rgb(204, 255, 204);
  border-color: #00cc00;
}
</style>
