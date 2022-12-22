<template>
  <v-card>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="items"
        :single-expand="true"
        :options.sync="options"
        :server-items-length="totalRecords"
        @update:options="getSortScooter()"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Scooter</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <input id="fileUpload" type="file" @change="handleDrop($event.target.files)" hidden>
            <v-btn color="success" dark class="mb-2" @click="onCreateClick()">Create</v-btn>
            <v-btn color="primary" dark class="mb-2 ml-2" @click="chooseFiles()">Import</v-btn>
               
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
                color="orange"
                class="mr-2"
                @click="onViewClick(item)"
              >
                mdi-eye
              </v-icon>
              <v-icon
                small
                color="blue"
                class="mr-2"
                @click="onEditClick(item)"
              >
                mdi-pencil
              </v-icon>
              <v-icon
                small
                color="red"
                class="mr-2"
                @click="onDeleteClick(item.id)"
              >
                mdi-delete
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
                  <!-- <tr
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
                  </tr> -->
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
      max-width="800"
    >
      <v-card>
        <v-toolbar color="primary" dark>
          Edit Scooter
        </v-toolbar>
        <v-card-text>
          <v-row class="px-10 pt-12">
            <v-col md="6" cols="12" >
              <v-text-field
                label="First Name"
                outlined
                v-model="editRecord.firstname"
              ></v-text-field>
            </v-col>
            <v-col md="6" cols="12" >
              <v-text-field
                label="Last Name"
                outlined
                v-model="editRecord.lastname"
              ></v-text-field>
            </v-col>
            <v-col md="6" cols="12" >
              <v-text-field
                label="Phone"
                outlined
                v-model="editRecord.phone"
              ></v-text-field>
            </v-col>
            <v-col md="6" cols="12" >
              <v-text-field
                label="Barcode"
                outlined
                v-model="editRecord.barcode"
              ></v-text-field>
            </v-col>
            <v-col md="6" cols="12" >
              <v-text-field
                label="Model"
                outlined
                v-model="editRecord.model"
              ></v-text-field>
            </v-col>
            <v-col md="6" cols="12" >
              <v-text-field
                label="Termen Aproximativ"
                outlined
                v-model="editRecord.termen"
              ></v-text-field>
            </v-col>
            <v-col cols="12" >
              <v-textarea
                label="problem"
                outlined
                v-model="editRecord.problem"
              ></v-textarea>
            </v-col>
            <v-col md="6" cols="12" >
              <v-text-field
                label="Price"
                outlined
                v-model="editRecord.price"
              ></v-text-field>
            </v-col>
            <v-col md="6" cols="12" >
              <v-select
                :items="scoooterStatusItems"
                label="Scooter Status"
                item-text="itemName"
                v-model="editRecord.statusId"
                outlined
              ></v-select>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn color="primary" @click="putEditCustomer()">Save</v-btn>
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
                label="Scooter Status"
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

    <!-- View Dialog -->
    <v-dialog
      v-model="isViewDialogEnabled"
      transition="dialog-bottom-transition"
      max-width="800"
    >
      <v-card>
        <v-toolbar color="primary" dark>
          View Scooter
        </v-toolbar>
        <v-card-text>
          <v-simple-table>
            <template v-slot:default>
              <tbody>
                <tr>
                  <td><h3 class="font-weight-black">Id</h3></td>
                  <td><h4 class="font-weight-medium">{{ viewRecord.id }}</h4></td>
                </tr>
                <tr>
                  <td><h3 class="font-weight-black">Name</h3></td>
                  <td><h4 class="font-weight-medium">{{ viewRecord.firstname }} {{ viewRecord.lastname }}</h4></td>
                </tr>
                <tr>
                  <td><h3 class="font-weight-black">Phone</h3></td>
                  <td><h4 class="font-weight-medium">{{ viewRecord.phone }}</h4></td>
                </tr>
                <tr>
                  <td><h3 class="font-weight-black">Barcode</h3></td>
                  <td><h4 class="font-weight-medium">{{ viewRecord.barcode }}</h4></td>
                </tr>
                <tr>
                  <td><h3 class="font-weight-black">Model</h3></td>
                  <td><h4 class="font-weight-medium">{{ viewRecord.model }}</h4></td>
                </tr>
                <tr>
                  <td><h3 class="font-weight-black">TERMEN APROXIMATIV</h3></td>
                  <td><h4 class="font-weight-medium">{{ viewRecord.termen }}</h4></td>
                </tr>
                <tr>
                  <td><h3 class="font-weight-black">Problem</h3></td>
                  <td><h4 class="font-weight-medium">{{ viewRecord.problem }}</h4></td>
                </tr>
                <tr>
                  <td><h3 class="font-weight-black">Price</h3></td>
                  <td><h4 class="font-weight-medium">{{ viewRecord.price }}</h4></td>
                </tr>
                <tr>
                  <td><h3 class="font-weight-black">Created at</h3></td>
                  <td><h4 class="font-weight-medium">{{ viewRecord.createdAt }}</h4></td>
                </tr>
                <tr>
                  <td><h3 class="font-weight-black">Updated at</h3></td>
                  <td><h4 class="font-weight-medium">{{ viewRecord.updatedAt }}</h4></td>
                </tr>
                <tr>
                  <td><h3 class="font-weight-black">Scooter Status</h3></td>
                  <td><h4 class="font-weight-medium">{{ scoooterStatusItems[viewRecord.statusId].itemName }}</h4></td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn color="primary" @click="$router.push('/admin/scooter/pdf/' + viewRecord.id)">Generate PDF</v-btn>
          <v-btn text @click="isViewDialogEnabled = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Dialog -->
    <v-dialog
      v-model="isDeleteDialogEnabled"
      transition="dialog-bottom-transition"
      max-width="300"
    >
      <v-card>
        <v-toolbar color="primary" dark>
          Delete Scooter
        </v-toolbar>
        <v-card-text>
          <v-row class="px-10 pt-12 pb-6 justify-center">
              <h2> Are you sure? </h2>
          </v-row>
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn color="primary" @click="deleteScooter()">Confirm</v-btn>
          <v-btn text @click="isDeleteDialogEnabled = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Excel View Dialog -->
    <v-dialog
      v-model="isExcelViewDialogEnabled"
      transition="dialog-bottom-transition"
      max-width="1000"
    >
      <v-card>
        <v-toolbar color="primary" dark>
          Excel file Preview
        </v-toolbar>
        <v-card-text>
          <v-data-table
            :headers="importData.headers"
            :items="importData.data"
            :single-expand="true"
            :server-items-length="importData.data.length"
            class="pt-8"
          >
            <template v-slot:item="{ item }">
              <tr>
                <td>
                  {{ item.firstname }}
                </td>
                <td>
                  {{ item.lastname }}
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
              </tr>
              
            </template>
            
          </v-data-table>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn color="primary" @click="postCreateExcel()">Save Database</v-btn>
          <v-btn text @click="isExcelViewDialogEnabled = false">Close</v-btn>
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
      isDeleteDialogEnabled: false,
      isViewDialogEnabled: false,
      isExcelViewDialogEnabled: false,
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
      editRecord: {},
      viewRecord: {},
      deleteRecordId: "-1",
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
      importData: {
        headers: [
          { text: "Firstname", value: "firstname", align: 'start' },
          { text: "Lastname", value: "lastname" },
          { text: "Phone", value: "phone" },
          { text: "Barcode", value: "barcode" },
          { text: "Model", value: "model" },
          { text: "Termen Aproximativ", value: "termen" },
          { text: "Problem", value: "problem" },
          { text: "Price", value: "price" },
        ],
        data: [],
      },  
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
      this.editRecord = item;
      this.$http
        .get("scooter/edit", {
          params: {
            id: item.id
          },
        })
        .then((response) => {
          if (response.data) {
            console.log(response.data);
            this.editRecord = response.data.result;
            this.isEditDialogEnabled = true;
          }
        })
        .catch((error) => {});
      
    },
    onDeleteClick(id) {
      this.deleteRecordId = id;
      this.isDeleteDialogEnabled = true;
    },
    onCreateClick() {
      this.isCreateDialogEnabled = true;
    },
    onViewClick(item) {
      this.viewRecord = item;
      this.isViewDialogEnabled = true;
    },
    postCreateScooter() {
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
    postCreateExcel (){
      this.$http
        .post("scooter/excel", this.importData.data)
        .then((response) => {
          if (response.data) {
            this.getScooter();
            this.isEditDialogEnabled = false;
            this.record = {};
            this.snackBar.enabled = true;
            this.snackBar.message = "Successfully added data in database";
          }
        })
        .catch((error) => {
          this.snackBar.enabled = true;
          this.snackBar.message = "Cannot edit customer at the moment";
        });
    },
    deleteScooter() {
      console.log(this.deleteRecordId);
      this.$http
        .delete("scooter/" + this.deleteRecordId)
        .then((response) => {
          if (response.data) {
            this.getScooter();
            this.isDeleteDialogEnabled = false;
            this.record = {};
            this.snackBar.enabled = true;
            this.snackBar.message = "Successfully delete Scooter";
          }
        })
        .catch((error) => {
          this.snackBar.enabled = true;
          this.snackBar.message = "Cannot edit customer at the moment";
        });
    },
    putEditCustomer() {
      this.$http
        .put("scooter", this.editRecord)
        .then((response) => {
          if (response.data) {
            this.getScooter();
            this.isEditDialogEnabled = false;
            this.record = {};
            this.snackBar.enabled = true;
            this.snackBar.message = "Successfully edited Scooter";
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
      console.log("getScooter");
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
    getSortScooter() {
      // console.log(this.options.sortBy[0]);
      // if (this.options.sortBy[0]) {
        console.log("clicked");
        console.log(this.options.sortBy);
        console.log(this.options.sortDesc);
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
      // }
    },
    findUser() {
      if (this.$route.query.email) {
        this.search = this.$route.query.email;
      }
    },
    handleDrop(fileList) {
      console.log("fileList");
      var f = fileList[0];
      var reader = new FileReader(), name = f.name
      reader.onload = (e) => {
        var results, 
            data = e.target.result, 
            fixedData = fixdata(data), 
            workbook=XLSX.read(btoa(fixedData), {type: 'base64'}), 
            firstSheetName = workbook.SheetNames[0], 
            worksheet = workbook.Sheets[firstSheetName];
        // this.importData.headers = get_header_row(worksheet);
        results = XLSX.utils.sheet_to_json(worksheet);
        this.importData.data = results;
        this.isExcelViewDialogEnabled = true;
      };
      reader.readAsArrayBuffer(f);
    },   
    chooseFiles() {
        document.getElementById("fileUpload").click()
    },

    generatePDF() {
      const columns = [
        { title: "Title", dataKey: "title" },
        { title: "Body", dataKey: "body" }
      ];
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "in",
        format: "letter"
      });
      console.log(this.viewRecord);
      // text is placed using x, y coordinates
      doc.setFontSize(25).setFont("Arial", 'bold').text("Proces verbal de intrare in service", 1.7, 2.4);
      doc.setFontSize(12).setFont("Arial", 'bold').text("NUME / PRENUME :", 0.5, 3.1);
      doc.setFontSize(12).setFont("Helvetica", 'normal').text(this.viewRecord.firstname + " " + this.viewRecord.lastname, 2, 3.1);
      doc.setFontSize(12).setFont("Arial", 'bold').text("TELEFON :", 0.5, 3.5);
      doc.setFontSize(12).setFont("Helvetica", 'normal').text(this.viewRecord.lastname, 1.3, 3.5);
      doc.setFontSize(12).setFont("Arial", 'bold').text("CODBARE :", 0.5, 3.9);
      doc.setFontSize(12).setFont("Helvetica", 'normal').text(this.viewRecord.barcode, 1.55, 3.9);
      doc.setFontSize(12).setFont("Arial", 'bold').text("MODEL :", 0.5, 4.3);
      doc.setFontSize(12).setFont("Helvetica", 'normal').text(this.viewRecord.barcode, 1.3, 4.3);
      doc.setFontSize(12).setFont("Arial", 'bold').text("TERMEN APROXIMATIV :", 0.5, 4.7);
      doc.setFontSize(12).setFont("Helvetica", 'normal').text(this.viewRecord.termen, 2.6, 4.7);
      doc.setFontSize(12).setFont("Arial", 'bold').text("PROBLEME :", 0.5, 5.1);
      doc.setLineWidth(2);
      doc.setDrawColor(255, 0, 0); 
      doc.rect(1.5, 6, 5, 8, 'S');
      doc.setFillColor(255,255,200);
      doc.rect(100, 20, 10, 10, 'F')
      doc.setFontSize(12).setFont("Arial", 'bold').text("COST REPARATIE :", 0.5, 6);
      doc.setFontSize(12).setFont("Helvetica", 'normal').text(this.viewRecord.price, 2.6, 6);
      // create a line under heading 
      // doc.setLineWidth(0.01).line(1.55, 2.15, 6.8, 2.15);
      // Using autoTable plugin
      // doc.autoTable({
      //   columns,
      //   body: this.editRecord,
      //   margin: { left: 0.5, top: 1.25 }
      // });
      // Using array of sentences
      const moreText="This is another few sentences of text to look at it.";
      doc
        .setFont("helvetica")
        .setFontSize(12)
        .text(moreText, 0.5, 7.5, { align: "left", maxWidth: "7.5" });
      
      // Creating footer and saving file
      doc
        .setFont("times")
        .setFontSize(11)
        .setFontStyle("italic")
        .setTextColor(0, 0, 255)
        .text(
          "This is a simple footer located .5 inches from page bottom",
          0.5,
          doc.internal.pageSize.height - 0.5
        )
        .save(`${this.heading}.pdf`);
    }
  },
  created() {
    this.findUser();
    this.getScooter();
  },
             
};

function fixdata(data) {
	var o = "", l = 0, w = 10240;
	for(; l<data.byteLength/w; ++l) o+=String.fromCharCode.apply(null,new Uint8Array(data.slice(l*w,l*w+w)));
	o+=String.fromCharCode.apply(null, new Uint8Array(data.slice(l*w)));
	return o;
}
function get_header_row(sheet) {
    var headers = [], range = XLSX.utils.decode_range(sheet['!ref']);
    var C, R = range.s.r; /* start in the first row */
    for(C = range.s.c; C <= range.e.c; ++C) { /* walk every column in the range */
        var cell = sheet[XLSX.utils.encode_cell({c:C, r:R})] /* find the cell in the first row */
        var hdr = "XXX"; // <-- replace with your desired default 
        if(cell && cell.t) {
          hdr = XLSX.utils.format_cell(cell);
        } else {
          continue
        }
        let column = {
          field: hdr,
          name: hdr,
          label: hdr
        }
        headers.push(column);
    }
    return headers;
}
</script>
