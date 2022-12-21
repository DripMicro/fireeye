<template>
  <v-card>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="items"
        :single-expand="true"
        :options.sync="options"
        :server-items-length="totalRecords"
        @update:options="getScooter()"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Scooter</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-btn color="primary" dark class="mb-2" @click="onCreateClick()">Create</v-btn>
            <v-btn color="primary" dark class="mb-2 ml-2">EXPORT</v-btn>
          </v-toolbar>
          <v-row class="mx-1">
            <v-col md="3">
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
                show-expand
                @input="onSearchInput"
                item-key="name"
              ></v-text-field>
            </v-col>
          </v-row>
        </template>
        <template v-slot:item="{ item }">
          <tr>
            <td>
              {{ item.id }}
            </td>
            <td>
              {{ item.firstname }} {{ item.lastname }}
            </td>
            <td>
              {{ item.phone }}
            </td>
            <td>
              {{ item.barcode }}
            </td>
            <td>
              {{ item.model }}
            </td>
            <td>
              {{ item.termen }}
            </td>
            <td>
              {{ item.problem }}
            </td>
            <td>
              {{ item.price }}
            </td>
            <td>
              {{ setDateTimeFormat(item.createdAt) }}
            </td>
            <td>
              {{ setDateTimeFormat(item.updatedAt) }}
            </td>
            <td>
              {{ scoooterStatusItems[item.statusId].itemName }}
            </td>
            <td>
              <v-icon
                small
                color="secondary"
                class="mr-2"
                @click="onEditClick(item)"
              >
                mdi-pencil
              </v-icon>
            </td>
          </tr>
        </template>

        <template v-slot:expanded-item="{ item, headers }">
          <td :colspan="headers.length" v-if="item.serial_numbers.length > 0">
            <div class="ma-4"><b>Products</b></div>
            <v-simple-table dense style="margin-bottom: 30px; margin-top: 10px">
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">ID</th>
                    <th class="text-left">Name</th>
                    <th class="text-left">Phone</th>
                    <th class="text-left">Barcode</th>
                    <th class="text-left">Model</th>
                    <th class="text-left">Termen Aproximative</th>
                    <th class="text-left">Problem</th>
                    <th class="text-left">Price</th>
                    <th class="text-left">Created At</th>
                    <th class="text-left">Updated At</th>
                    <th class="text-left">Scooter Status</th>
                    <th class="text-left"></th>
                    <!-- <th class="text-left">Actions</th> -->
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(productItem, productIndex) in item.serial_numbers"
                    :key="productIndex"
                  >
                    <td>{{ productItem.serial_no }}</td>
                    <td>{{ setDateFormat(productItem.created_at) }}</td>
                    <td>
                      {{ setDateFormat(productItem.activation_date) }}
                    </td>
                    <td>
                      <v-chip
                        :color="
                          setDateExpiryColor(productItem.warranty_expiry_date)
                        "
                      >
                        {{ setDateFormat(productItem.warranty_expiry_date) }}
                      </v-chip>
                    </td>
                    <td>
                      <v-chip
                        :color="
                          setDateExpiryColor(productItem.product_expiry_date)
                        "
                      >
                        {{ setDateFormat(productItem.product_expiry_date) }}
                      </v-chip>
                    </td>
                    <td>
                      <v-chip :color="getStatus(productItem.status).color" dark>
                        {{ getStatus(productItem.status).name }}
                      </v-chip>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </td>
        </template>
      </v-data-table>
    </v-card-text>

    <!-- Edit Dialog -->
    <v-dialog
      v-model="isEditDialogEnabled"
      transition="dialog-bottom-transition"
      max-width="500"
    >
      <v-card>
        <v-toolbar color="primary" dark>
          Edit Customer: {{ record.name }}
        </v-toolbar>
        <v-row class="px-10 pt-6">
          <v-col md="6">
            <v-text-field
              label="Name"
              outlined
              v-model="record.name"
            ></v-text-field>
          </v-col>
          <v-col md="6">
            <v-text-field
              label="Mobile Number"
              outlined
              v-model="record.mobile_number"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-card-actions class="justify-end">
          <v-btn color="primary" @click="putEditCustomer()">Confirm</v-btn>
          <v-btn text @click="isEditDialogEnabled = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Create Dialog -->
    <v-dialog
      v-model="isCreateDialogEnabled"
      transition="dialog-bottom-transition"
      max-width="800"
    >
      <v-card>
        <v-toolbar color="primary" dark>
          Create Scooter
        </v-toolbar>
        <v-card-text>
          <v-row class="px-10 pt-12">
            <v-col md="6" cols="12" >
              <v-text-field
                label="First Name"
                outlined
                v-model="record.firstname"
              ></v-text-field>
            </v-col>
            <v-col md="6" cols="12" >
              <v-text-field
                label="Last Name"
                outlined
                v-model="record.lastname"
              ></v-text-field>
            </v-col>
            <v-col md="6" cols="12" >
              <v-text-field
                label="Phone"
                outlined
                v-model="record.phone"
              ></v-text-field>
            </v-col>
            <v-col md="6" cols="12" >
              <v-text-field
                label="Barcode"
                outlined
                v-model="record.barcode"
              ></v-text-field>
            </v-col>
            <v-col md="6" cols="12" >
              <v-text-field
                label="Model"
                outlined
                v-model="record.model"
              ></v-text-field>
            </v-col>
            <v-col md="6" cols="12" >
              <v-text-field
                label="Termen Aproximativ"
                outlined
                v-model="record.termen"
              ></v-text-field>
            </v-col>
            <v-col cols="12" >
              <v-textarea
                label="problem"
                outlined
                v-model="record.problem"
              ></v-textarea>
            </v-col>
            <v-col md="6" cols="12" >
              <v-text-field
                label="Price"
                outlined
                v-model="record.price"
              ></v-text-field>
            </v-col>
            <v-col md="6" cols="12" >
              <v-select
                :items="scoooterStatusItems"
                label="Outlined style"
                item-text="itemName"
                v-model="record.statusId"
                outlined
              ></v-select>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn color="primary" @click="postCreateScooter()">Create</v-btn>
          <v-btn text @click="isCreateDialogEnabled = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackBar.enabled" timeout="3000">
      {{ snackBar.message }}
      <template v-slot:action="{ attrs }">
        <v-btn
          color="blue"
          text
          v-bind="attrs"
          @click="snackBar.enabled = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-card>
</template>

<script>
import moment from "moment";
export default {
  data() {
    return {
      isEditDialogEnabled: false,
      isCreateDialogEnabled: false,
      snackBar: {
        enabled: false,
        message: "",
      },
      expanded: [],
      options: {},
      totalRecords: 0,
      search: "",
      items: [],
      scoooterStatusItems: [
        {value: '0', itemName: 'At Work'},
        {value: '1', itemName: 'Completed'},
        {value: '2', itemName: 'Exit'}
      ],
      record: {},
      headers: [
        {
          text: "ID",
          align: "start",
          value: "id",
        },
        { text: "Name", value: "fullname" },
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
    };
  },
  methods: {
    setDateFormat(date) {
      return moment(date).format("DD/MM/YYYY");
    },
    setDateTimeFormat(date) {
      return moment(date).format("DD/MM/YYYY h:mm A");
    },
    setDateExpiryColor(date) {
      if (
        moment(date).isBetween(
          moment().subtract(30, "days"),
          moment().add(30, "days")
        )
      ) {
        return "red";
      } else {
        return "white";
      }
    },
    onEditClick(item) {
      this.record = item;
      this.isEditDialogEnabled = true;
    },
    onCreateClick() {
      this.isCreateDialogEnabled = true;
    },
    postCreateScooter() {
      console.log(this.record);
      this.$http
        .post("scooter", this.record)
        .then((response) => {
          if (response.data) {
            this.getScooter();
            this.isEditDialogEnabled = false;
            this.record = {};
            this.snackBar.enabled = true;
            this.snackBar.message = "Successfully create Scooter";
          }
        })
        .catch((error) => {
          this.snackBar.enabled = true;
          this.snackBar.message = "Cannot edit customer at the moment";
        });
    },
    putEditCustomer() {
      this.$http
        .put("admin/customer/" + this.record.id, this.record)
        .then((response) => {
          if (response.data) {
            this.getScooter();
            this.isEditDialogEnabled = false;
            this.record = {};
            this.snackBar.enabled = true;
            this.snackBar.message = "Successfully edited user";
          }
        })
        .catch((error) => {
          this.snackBar.enabled = true;
          this.snackBar.message = "Cannot edit customer at the moment";
        });
    },
    getStatus(id) {
      switch (id) {
        case 1:
          return {
            id: id,
            name: "New",
            color: "#4caf50",
          };
        case 2:
          return {
            id: id,
            name: "Under Warranty",
            color: "#1e88e5",
          };
        case 3:
          return {
            id: id,
            name: "Replaced",
            color: "#fb8c00",
          };
        case 4:
          return {
            id: id,
            name: "Replacement",
            color: "#fdd835",
          };
        default:
          return {
            id: id,
            name: "New",
            color: "#4caf50",
          };
      }
    },
    onSearchInput() {
      this.getScooter();
    },
    getScooter() {
      this.$http
        .get("scooter", {
          params: {
            page: this.options.page,
            sort_by: this.options.sortBy ? this.options.sortBy[0] : null,
            descending: this.options.sortDesc ? this.options.sortDesc[0] : null,
            rows_per_page: this.options.itemsPerPage,
            search: this.search,
          },
        })
        .then((response) => {
          if (response.data) {
            console.log(response.data);
            this.items = response.data.result;
            this.totalRecords = response.data.count;
          }
        })
        .catch((error) => {});
    },
    findUser() {
      if (this.$route.query.email) {
        this.search = this.$route.query.email;
      }
    },
  },
  created() {
    this.findUser();
    this.getScooter();
  },
};
</script>
