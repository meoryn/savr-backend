
import express from 'express';
import cors from 'cors';
import authRoutes from './authRoutes.js';
import balanceRoute from './balanceRoute.js';
import transactionRoute from './transactionRoute.js';
import tableRoute from './tableRoute.js';
import monthly_limitRoute from './monthly_limitRoute.js';
import logoutRoute from './logoutRoute.js'
import monthlyReport from './monthlyReport.js'
import expensesRoute from './expensesRoute.js'

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



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use("/", authRoutes);


app.use("/", transactionRoute);


app.use("/", balanceRoute);


app.use("/", monthly_limitRoute);


app.use("/", logoutRoute);


app.use("/", tableRoute);

app.use("/", monthlyReport);

app.use("/", expensesRoute);

app.listen(port, () => {
  console.log(` Server running at port ${port}`);
});
