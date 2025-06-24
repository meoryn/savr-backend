
import express from 'express';
import cors from 'cors';
import authRoutes from './authRoutes.js';
import balanceRoute from './balanceRoute.js';
import transactionRoute from './transactionRoute.js';
import tableRoute from './tableRoute.js';
import monthly_limitRoute from './monthly_limitRoute.js';
import logoutRoute from './logoutRoute.js';
import monthlyReport from './monthlyReport.js';
import expensesRoute from './expensesRoute.js';
import availableMonthsRoute from './availableMonths.js';
import usedCategoriesRoute from './usedCategories.js';
import recurringEntriesRoute from './recurringEntriesRoute.js';
import monthlySpendingsRoute from './monthlySpendings.js';
import { supabase } from './supabaseClient.js';

const app = express()
const port = 4000

const allowedOrigins = [
  'http://localhost:3000',
];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

app.use(express.json());



app.use("/", authRoutes);


app.use("/", transactionRoute);


app.use("/", balanceRoute);


app.use("/", monthly_limitRoute);


app.use("/", logoutRoute);


app.use("/", tableRoute);

app.use("/", monthlyReport);

app.use("/", expensesRoute);

app.use("/", availableMonthsRoute);

app.use("/", usedCategoriesRoute);

app.use("/", recurringEntriesRoute);

app.use("/", monthlySpendingsRoute);

app.listen(port, () => {
  console.log(` Server running at port ${port}`);
});
