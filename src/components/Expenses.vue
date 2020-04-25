<template>
<div class='container'>
<div class='row'>
<div class='col-sm-10'>
<h1>SCT Expenses</h1>
<hr><br><br>
<alert :message='message' v-if='showMessage'></alert>
<button type='button' class='btn btn-success btn-sm' v-b-modal.expense-modal>Add Expense</button>
<br><br>
<table class='table table-hover'>
<thead>
<tr>
<th scope='col'>payee</th>
<th scope='col'>Date Due</th>
<th scope='col'>amount</th>
<th scope='col'>paid</th>
<th></th>
</tr>
</thead>
<tbody>
<tr v-for='(expense, index) in expenses' :key='index'>
<td>{{ expense.payee }}</td>
<td>{{ expense.due_date }} </td>
<td>${{ expense.amount }}</td>
<td>
<span v-if='expense.paid'>Yes</span>
<span v-else>No</span>
</td>
<td>
<div class='btn-group' role='group'>
<button type='button'
class='btn btn-warning btn-sm'
v-b-modal.expense-update-modal
@click=editExpense(expense)>
Update</button>
<button type='button' class=' ml-2 btn btn-danger btn-sm'>Delete</button>
</div>
</td>
</tr>
</tbody>
</table>
</div>
</div>
<b-modal ref='addExpenseModal' id='expense-modal' title='Add a new expense' hide-footer>
<b-form @submit='onSubmit' @reset='onReset' class='w-100'>
<b-form-group id='form-payee-group' label='payee:' label-for='form-payee-input'>
<b-form-input
id='form-payee-input'
type='text'
v-model='addExpenseForm.payee'
required
placeholder="Enter payee's name">
</b-form-input>
</b-form-group>
<b-form-group
id='form-due_date-group'
label='Date Due:'
label-for='form-due_date-input'>
<b-form-input
id='form-due_date-input'
type='text'
v-model='addExpenseForm.due_date'
required placeholder='Enter the due date'>
</b-form-input>
</b-form-group>
<b-form-group
id='form-amount-group'
label='amount:'
label-for='form-amount-input'>
<b-form-input
id='form-amount-input'
type='text'
v-model='addExpenseForm.amount'
required
placeholder='Add amount'>
</b-form-input>
</b-form-group>
<b-form-group id='form-paid-group'>
<b-form-checkbox-group v-model='addExpenseForm.paid' id='form-checks'>
<b-form-checkbox value='true'>paid?</b-form-checkbox>
</b-form-checkbox-group>
</b-form-group>
<b-button type='submit' variant='primary'>Submit</b-button>
<b-button type='reset' variant='danger'>Reset</b-button>
</b-form>
</b-modal>
<b-modal ref='editExpenseModal'
id='expense-update-modal'
title='Update'
hide-footer>
<b-form @submit='onSubmitUpdate' @reset='onResetUpdate' class='w-100'>
<b-form-group id='form-payee-edit-group'
label='payee:'
label-for='form-payee-edit-input'>
<b-form-input id='form-payee-edit-input'
type='text'
v-model='editForm.payee'
required
placeholder='Enter payee'>
</b-form-input>
</b-form-group>
<b-form-group
id='form-due_date-edit-group'
label='Date Due:'
label-for='form-due_date-edit-input'>
<b-form-input
id='form-due_date-edit-input'
type='text'
v-model='editForm.due_date'
required
placeholder='Enter the Due Date'>
</b-form-input>
</b-form-group>
<b-form-group
id='form-amount-edit-group'
label='amount:'
label-for='form-amount-edit-input'>
<b-form-input
id='form-amount-edit-input'
type='text'
v-model='editForm.amount'
required
placeholder='Enter amount'>
</b-form-input>
</b-form-group>
<b-form-group id='form-paid-edit-group'>
<b-form-checkbox-group v-model='editForm.paid' id='form-checks'>
<b-form-checkbox value='true'>paid?</b-form-checkbox>
</b-form-checkbox-group>
</b-form-group>
<b-button-group>
<b-button type='submit' variant='primary'>Update</b-button>
<b-button type='reset' variant='danger'>Cancel</b-button>
</b-button-group>
</b-form>
</b-modal>
</div>
</template>

<script>
import axios from 'axios';
import Alert from './Alert.vue';

export default {
  data() {
    return {
      expenses: [],
      addExpenseForm: {
        payee: '',
        due_date: '',
        amount: '',
        paid: [],
      },
      editForm: {
        id: '',
        payee: '',
        due_date: '',
        amount: '',
        paid: [],
      },
      message: '',
      showMessage: false,
    };
  },
  components: {
    alert: Alert,
  },
  methods: {
    getExpenses() {
      const path = 'http://localhost:5000/expenses';
      axios
        .get(path)
        .then((res) => {
          this.expenses = res.data.expenses;
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.error(error);
        });
    },
    addExpense(payload) {
      const path = 'http://localhost:5000/expenses';
      axios
        .post(path, payload)
        .then(() => {
          this.getExpenses();
          this.message = 'Expense added!';
          this.showMessage = true;
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
          this.getExpenses();
        });
    },
    updateExpense(payload, expenseID) {
      const path = `http://localhost:5000/expenses/${expenseID}`;
      axios
        .put(path, payload)
        .then(() => {
          this.getExpenses();
          this.message = 'Expense Updated!';
          this.showMessage = true;
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.error(error);
          this.getExpenses();
        });
    },
    initForm() {
      this.addExpenseForm.payee = '';
      this.addExpenseForm.due_date = '';
      this.addExpenseForm.amount = '';
      this.addExpenseForm.paid = [];
      this.editForm.id = '';
      this.editForm.payee = '';
      this.editForm.amount = '';
      this.editForm.due_date = '';
      this.editForm.paid = [];
    },
    onSubmit(evt) {
      evt.preventDefault();
      this.$refs.addExpenseModal.hide();
      let paid = false;
      if (this.addExpenseForm.paid[0]) paid = true;
      const payload = {
        payee: this.addExpenseForm.payee,
        due_date: this.addExpenseForm.due_date,
        amount: this.addExpenseForm.amount,
        paid, // property shorthand
      };
      this.addExpense(payload);
      this.initForm();
    },
    onReset(evt) {
      evt.preventDefault();
      this.initForm();
    },
    editExpense(expense) {
      this.editForm = expense;
    },
    onSubmitUpdate(evt) {
      evt.preventDefault();
      this.$refs.editExpenseModal.hide();
      let paid = false;
      if (this.editForm.paid[0]) paid = true;
      const payload = {
        payee: this.editForm.payee,
        due_date: this.editForm.due_date,
        amount: this.editForm.amount,
        paid,
      };
      this.updateExpense(payload, this.editForm.id);
    },
    onResetUpdate(evt) {
      evt.preventDefault();
      this.$refs.editExpenseModal.hide();
      this.initForm();
      this.getExpenses();
    },
  },
  created() {
    this.getExpenses();
  },
};
</script>
