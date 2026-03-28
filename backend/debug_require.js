try {
  console.log('Requiring express...');
  require('express');
  console.log('Requiring cors...');
  require('cors');
  console.log('Requiring mongoose...');
  require('mongoose');
  console.log('Requiring @google/generative-ai...');
  require('@google/generative-ai');
  console.log('Requiring dotenv...');
  require('dotenv');
  
  console.log('Requiring auth routes...');
  require('./auth-service/routes/auth');
  console.log('Requiring notifications routes...');
  require('./auth-service/routes/notifications');
  
  console.log('Requiring donor routes...');
  require('./donor-service/routes/donor');
  console.log('Requiring donor appointments...');
  require('./donor-service/routes/appointments');
  
  console.log('Requiring hospital routes...');
  require('./hospital-service/routes/hospital');
  console.log('Requiring hospital appointments...');
  require('./hospital-service/routes/appointments');
  
  console.log('Requiring request routes...');
  require('./request-service/routes/requests');
  console.log('Requiring matching routes...');
  require('./request-service/routes/matching');
  
  console.log('All requires successful!');
} catch (err) {
  console.error('Error during require:', err.message);
  console.error('Stack:', err.stack);
}
