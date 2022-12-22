<template>
  <div>
    <v-row class="px-10 pt-12 pb-6 justify-center">
      <v-col cols="12"  class="d-flex justify-center">
        <img src="./../../assets/logo_big.jpg" alt="">
      </v-col>
      <v-col cols="12" ><h1 class="text-center">Proces verbal de intrare in service</h1></v-col>
    </v-row>
    <v-row class="pl-3 justify-center">
      <v-col cols="12" >
        <span class="text-left">
          Nume / Prenume : 
        </span>
        <span class="pl-2 text-left">
          {{items.firstname}} {{items.lastname}}
        </span>
      </v-col>
    </v-row>
    <v-row class="pl-3 pb-3 justify-center">
      <v-col cols="6" >
        <v-row class="justify-center">
          <v-col cols="12" >
            <span class="text-left">
              Telefon : 
            </span>
            <span class="pl-2 text-left">
              {{items.phone}}
            </span>
          </v-col>
          <v-col cols="12" >
            <span class="text-left">
              CODBARE : 
            </span>
            <span class="pl-2 text-left">
              {{items.barcode}}
            </span>
          </v-col>
          <v-col cols="12" >
            <span class="text-left">
              CODBARE : 
            </span>
            <span class="pl-2 text-left">
              {{items.barcode}}
            </span>
          </v-col>
          <v-col cols="12" >
            <span class="text-left">
              MODEL : 
            </span>
            <span class="pl-2 text-left">
              {{items.model}}
            </span>
          </v-col>
          <v-col cols="12" >
            <span class="text-left">
              TERMEN APROXIMATIV : 
            </span>
            <span class="pl-2 text-left">
              {{items.termen}}
            </span>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="6" >
        <v-row class="justify-center">
          <v-col cols="12" >
            <p class="text-left">
              SEMNATURA
            </p>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row class="pl-3 justify-center">
      <v-col cols="12" >
          <p class="text-left">
            Probleme : 
          </p>
          <div style="width: 100%; height:200px; border: 2px solid green">
            <p class="px-4 pt-2 text-left">
              {{ items.problem }}
            </p>
          </div>
      </v-col>
    </v-row>
    <v-row class="pl-3 justify-center">
      <v-col cols="12" >
        <span class="text-left">
          Cost reparatie : 
        </span>
        <span class="pl-2 text-left">
          {{items.price}}
        </span>
      </v-col>
      <v-col cols="12" >
        <span class="text-left red--text">
          Am luat la cunostinta pretul si termenul de executie al lucrarii
        </span>
      </v-col>
      <v-col cols="12" >
        <v-checkbox 
          v-model="checkbox"
          label="Sunt de acord cu preluarea si prelucrarea datelor cu caracter personal conform procedurii GDPR"
        >
          
        </v-checkbox>
        <!-- <span class="px-2 text-left">
          Sunt de acord cu preluarea si prelucrarea datelor cu caracter personal conform procedurii GDPR
        </span> -->
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="3" >
        <span class="px-2 text-left">
          DOCTOR TROTINETA 
        </span>
      </v-col>
      <v-col cols="3" >
        <span class="px-2 text-left">
          DATA : 
        </span>
        <span class="px-2 text-left">
          {{ setDateFormat(items.updatedAt) }}
        </span>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" >
        <span class="px-2 text-left ">
          {{ items.phone }}
        </span>
      </v-col>
      <v-col cols="12" >
        <span class="px-2 text-left ">
          <a href="https://doctortrotineta.ro" style="color: rgba(0,0,0,.87); text-decoration: none;" >www.doctortrotineta.ro</a>
        </span>
      </v-col>
      <v-col cols="12" >
        <span class="px-2 text-left red--text">
          ATENTIE! Neridicarea trotinetelor in termen de 48h aduce o taxa suplimentara in valoare de 10lei/zi.
        </span>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import moment from "moment";
export default {
  data() {
    return {
      items: [],
      record: {},
      headers: [
        {
          text: "ID",
          align: "start",
          value: "id",
        },
        { text: "Name", value: "firstname" },
        { text: "Phone", value: "phone" },
        { text: "Barcode", value: "barcode" },
        { text: "Model", value: "model" },
        { text: "Termen Aproximativ", value: "termen" },
        { text: "Problem", value: "problem" },
        { text: "Price", value: "price" },
        { text: "Created At", value: "createdAt" },
        { text: "Updated At", value: "updatedAt" },
        { text: "Scooter Status", value: "statusId" }
      ],
      date: ""
    };
  },
  methods: {
    setDateFormat(date) {
      return moment(date).format("DD/MM/YYYY");
    },
    getScooter() {
      console.log(this.$route.params.id);
      this.$http
        .get("scooter/" + this.$route.params.id)
        .then((response) => {
          if (response.data) {
            console.log(response.data);
            this.items = response.data.result;
          }
        })
        .catch((error) => {});
    },
  },
  created() {
    this.getScooter();
  },
             
};

</script>
