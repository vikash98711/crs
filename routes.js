const express = require('express');
const sql = require('mssql');
const multer = require('multer');
const config = require('./config'); 


const { checkDbConnection } = require('./config');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });



const router = express();



// role api starting here 
router.post('/Role', async (req, res) => {
  // console.log(req.body)
  const { deafaultvar, RoleName, DisplayStatus } = req.body;

  try {
    const pool = await sql.connect(config);
    const request = pool.request();

    // Convert deafaultvar to integer
    const deafaultvarAsInt = parseInt(deafaultvar);

    // console.log('Executing SQL query...');
    // console.log('Params:', deafaultvarAsInt, RoleName, DisplayStatus);

    // Call the stored procedure to insert data into the table
    await request
  .input('deafaultvar', sql.Int, deafaultvarAsInt)
  .input('RoleName', sql.VarChar(50), RoleName)
  .input('DisplayStatus', sql.Bit, DisplayStatus)
  // .execute('[upcloud].[InsertRolee]');
  // .execute('InsertRolee');
  .execute('InsertIntoCRMRole');
  // .execute('[upcloudglobal].[InsertIntoCRMRole]');



    console.log('SQL query executed successfully.');

    res.status(201).json({ message: 'Registration inserted successfully' });
  } catch (error) {
    console.error('Error inserting registration data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



router.get('/getAllRoles', async (req, res) => {
  try {
    // Reuse the existing config object
    const pool = await sql.connect(config);
    const request = pool.request();

    // Execute the stored procedure to get all roles
    // const result = await request.execute('SelectAllFromRole');
    const result = await request.execute('SelectIntoCRMRole');

    // Send the retrieved data as JSON
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('Error retrieving data:', error);
    res.status(500).json({ error: 'Internal server error' });
  } 
});






// role api ending


// department api starting here 
router.post('/departmentregistered', async (req, res) => {
  // console.log(req.body)
  const { deafaultvar, DepartmentName, DisplayStatus } = req.body;

  try {
    const pool = await sql.connect(config);
    const request = pool.request();

    // Convert deafaultvar to integer
    const deafaultvarAsInt = parseInt(deafaultvar);

    // console.log('Executing SQL query...');
    // console.log('Params:', deafaultvarAsInt, RoleName, DisplayStatus);

    // Call the stored procedure to insert data into the table
    await request
  .input('deafaultvar', sql.Int, deafaultvarAsInt)
  .input('DepartmentName', sql.VarChar(50), DepartmentName)
  .input('DisplayStatus', sql.Bit, DisplayStatus)
  // .execute('[upcloud].[InsertRolee]');
  // .execute('InsertRolee');
  .execute('InsertIntoCRMDepartment');
  // .execute('[upcloudglobal].[InsertIntoCRMRole]');



    console.log('SQL query executed successfully.');

    res.status(201).json({ message: 'Registration inserted successfully' });
  } catch (error) {
    console.error('Error inserting registration data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/getAlldepartment', async (req, res) => {
  try {
    // Reuse the existing config object
    const pool = await sql.connect(config);
    const request = pool.request();

    // Execute the stored procedure to get all roles
    // const result = await request.execute('SelectAllFromRole');
    const result = await request.execute('SelectIntoCRMDepartment');

    // Send the retrieved data as JSON
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('Error retrieving data:', error);
    res.status(500).json({ error: 'Internal server error' });
  } 
});


// department api ending 



// setting api starting here 
// setting api starting here 
// general api starting 
router.post('/SettingGeneral', upload.fields([
  { name: 'CompanyLogo', maxCount: 1 },
  { name: 'CompanyLogoDark', maxCount: 1 },
  { name: 'Favicon', maxCount: 1 },
]), async (req, res) => {
  try {
    const { defaultVar, CompanyName, CompanyDomain, RTLAdmin, RTLCustomerArea, AllowedFileTypes } = req.body;

    // Check if a file was uploaded
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Extract file buffers from req.files
    const {
      CompanyLogo,
      CompanyLogoDark,
      Favicon,
    } = req.files;

    const pool = await sql.connect(config);
    const request = pool.request();

    request
      .input('defaultVar', sql.Int, defaultVar)
      .input('CompanyLogo', sql.VarBinary(sql.MAX), CompanyLogo[0].buffer)
      .input('CompanyLogoDark', sql.VarBinary(sql.MAX), CompanyLogoDark[0].buffer)
      .input('Favicon', sql.VarBinary(sql.MAX), Favicon[0].buffer)
      .input('CompanyName', sql.VarChar(100), CompanyName)
      .input('CompanyDomain', sql.VarChar(255), CompanyDomain)
      .input('RTLAdmin', sql.Bit, RTLAdmin)
      .input('RTLCustomerArea', sql.Bit, RTLCustomerArea)
      .input('AllowedFileTypes', sql.VarChar(sql.MAX), AllowedFileTypes);

    const result = await request.execute('InsertIntoSetting_General');

    // sql.close(); // Close the database connection

    if (result.returnValue === 0) {
      res.status(201).json({ message: 'Data inserted or updated successfully' });
    } else {
      res.status(500).json({ error: 'Error inserting or updating data' });
    }
  } catch (err) {
    console.error('Error processing the request:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/SelectIntoSetting_General', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const request = pool.request();

    const result = await request.execute('upcloudglobal.SelectIntoSetting_General');

    // sql.close(); // Close the database connection

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json({ error: 'No data found' });
    }
  } catch (err) {
    console.error('Error processing the request:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// general api ending

// company information api starting here 
router.post('/InsertCompanyInfo', upload.none(), async (req, res) => {
  try {
  const {Deafaultvar,CompanyName,Address,City,State,Country_Code,Zip_Code,Phone_No,VAT_Num,Company_Format} = req.body;

    const pool = await sql.connect(config);
    const request = pool.request();

    request
      .input('Deafaultvar', sql.Int, Deafaultvar)
      .input('CompanyName', sql.VarChar(55), CompanyName)
      .input('Address', sql.VarChar(60), Address)
      .input('City', sql.VarChar(55), City)
      .input('State', sql.VarChar(55), State)
      .input('Country_Code', sql.VarChar(10), Country_Code)
      .input('Zip_Code', sql.Int, Zip_Code)
      .input('Phone_No', sql.BigInt, Phone_No)
      .input('VAT_Num', sql.BigInt, VAT_Num)
      .input('Company_Format', sql.VarChar(sql.MAX), Company_Format);

    const result = await request.execute('InsertCompanyInfo');

    // sql.close(); // Close the database connection

    if (result.returnValue === 0) {
      res.status(201).json({ message: 'Data inserted or updated successfully' });
    } else {
      res.status(500).json({ error: 'Error inserting or updating data' });
    }
  } catch (err) {
    console.error('Error processing the request:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/SelectCompanyInfo', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const request = pool.request();

    const result = await request.execute('upcloudglobal.SelectCompanyInfo');

    // sql.close(); // Close the database connection

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json({ error: 'No data found' });
    }
  } catch (err) {
    console.error('Error processing the request:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// company information api ending  here 


// localization api starting here

router.post('/InsertLocalization', upload.none(), async (req, res) => {
  try {
    const {
      Deafaultvar,
      Date_Format,
      Time_Format,
      Default_Timezone,
      Default_Language,
      Disable_Language,
      Client_Language
    } = req.body;

    const pool = await sql.connect(config);
    const request = pool.request();

    request
      .input('Deafaultvar', sql.Int, Deafaultvar)
      .input('Date_Format', sql.VarChar(50), Date_Format)
      .input('Time_Format', sql.VarChar(50), Time_Format)
      .input('Default_Timezone', sql.VarChar(50), Default_Timezone)
      .input('Default_Language', sql.VarChar(50), Default_Language)
      .input('Disable_Language', sql.Bit, Disable_Language)
      .input('Client_Language', sql.Bit, Client_Language);

    const result = await request.execute('InsertLocalization');

    // sql.close(); // Close the database connection

    if (result.returnValue === 0) {
      res.status(201).json({ message: 'Data inserted or updated successfully' });
    } else {
      res.status(500).json({ error: 'Error inserting or updating data' });
    }
  } catch (err) {
    console.error('Error processing the request:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



router.get('/SelectLocalization', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const request = pool.request();

    const result = await request.execute('upcloudglobal.SelectLocalization');

    // sql.close(); // Close the database connection

    if (result.recordset.length > 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json({ error: 'No data found' });
    }
  } catch (err) {
    console.error('Error processing the request:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// localization api ending here 



// email api starting here

router.post('/InsertEmailSmtpSettings', upload.none(), async (req, res) => {
  try {
    const {
      Deafaultvar,
      MailEngine,
      EmailProtocol,
      EmailEncryption,
      SmtpHost,
      SmtpPort,
      Email,
      SmtpUsername,
      SmtpPassword,
      EmailCharset,
      BccEmail,
      EmailSignature,
      PreHeader,
      PreFooter,
      SendTestEmail
    } = req.body;

    const pool = await sql.connect(config);
    const request = pool.request();

    request
      .input('Deafaultvar', sql.Int, Deafaultvar)
      .input('MailEngine', sql.VarChar(255), MailEngine)
      .input('EmailProtocol', sql.VarChar(50), EmailProtocol)
      .input('EmailEncryption', sql.VarChar(50), EmailEncryption)
      .input('SmtpHost', sql.VarChar(255), SmtpHost)
      .input('SmtpPort', sql.BigInt, SmtpPort)
      .input('Email', sql.VarChar(255), Email)
      .input('SmtpUsername', sql.VarChar(255), SmtpUsername)
      .input('SmtpPassword', sql.VarChar(255), SmtpPassword)
      .input('EmailCharset', sql.VarChar(50), EmailCharset)
      .input('BccEmail', sql.Bit, BccEmail)
      .input('EmailSignature', sql.VarChar(sql.MAX), EmailSignature)
      .input('PreHeader', sql.VarChar(sql.MAX), PreHeader)
      .input('PreFooter', sql.VarChar(sql.MAX), PreFooter)
      .input('SendTestEmail', sql.Bit, SendTestEmail);

    const result = await request.execute('InsertEmailSmtpSettings');

    sql.close(); // Close the database connection

    if (result.returnValue === 0) {
      res.status(201).json({ message: 'Data inserted or updated successfully' });
    } else {
      res.status(500).json({ error: 'Error inserting or updating data' });
    }
  } catch (err) {
    console.error('Error processing the request:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// email api ending here 





// setting api ending here 
// setting api ending here 






router.post('/insert-registration', async (req, res) => {
    try {
        const { Defaultvar, FULLNAME, SCHOOLNAME, CLASS, STREAMS, MOBILENUMBER, HOMENUMBER, EMAILID,createdBy  } = req.body;
  
        const pool = await sql.connect(config);
        const request = pool.request();
  
        // Call the stored procedure to insert data into the table
        await request
            .input('var', sql.Int,Defaultvar)
            .input('FULLNAME', sql.VarChar(50), FULLNAME)
            .input('SCHOOLNAME', sql.VarChar(50), SCHOOLNAME)
            .input('CLASS', sql.VarChar(50), CLASS)
            .input('STREAMS', sql.VarChar(50), STREAMS)
            .input('MOBILENUMBER', sql.VarChar(50), MOBILENUMBER)
            .input('HOMENUMBER', sql.VarChar(50), HOMENUMBER)
            .input('EMAILID', sql.VarChar(50), EMAILID)
            .input('createdBy', sql.Int, createdBy)
           
            
            // .input('createdBy', sql.Int, createdBy)
            // .input('modifiedBy', sql.Int, modifiedBy)
            .execute('DRAW_REGISTRATIONS');
  
        res.status(201).json({ message: 'Registration inserted successfully' });
    } catch (error) {
        console.error('Error inserting registration data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
  });
  router.post('/EmployeeProfile', async (req, res) => {
    console.log(req.body);
    try {
        const { Defaultvar, EmpolyeeId, FullName, MobileNumber, HomeAddress, Age, Gender, CreatedBy  } = req.body;
  
        const pool = await sql.connect(config);
        const request = pool.request();
  
        // Call the stored procedure to insert data into the table
        await request
            .input('var', sql.Int,Defaultvar)
            .input('EmpolyeeId', sql.VarChar(50), EmpolyeeId)
            .input('FullName', sql.VarChar(50), FullName)
  
         
            .input('MobileNumber', sql.VarChar(50),  MobileNumber)
          
            .input('HomeAddress', sql.VarChar(50), HomeAddress)
            .input('Age', sql.VarChar(50), Age)
            .input('Gender', sql.VarChar(50), Gender)
            .input('CreatedBy', sql.Int, CreatedBy)
           
            
            // .input('createdBy', sql.Int, createdBy)
            // .input('modifiedBy', sql.Int, modifiedBy)
            .execute('Employee_Loginprocedure');
  
        res.status(201).json({ message: 'Registration inserted successfully' });
    } catch (error) {
        console.error('Error inserting registration data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  router.get('/getAllEmployeeProfiles', async (req, res) => {
    try {
      const pool = await sql.connect(config);
      const request = pool.request();
  
      // Execute the stored procedure to get all employee profiles
      const result = await request.execute('GetAllEmpolyeeProfiles');
  
      res.status(200).json(result.recordset); // Send the retrieved data as JSON
    } catch (error) {
      console.error('Error retrieving data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  
  
  
  
  // department get all data api starting 
  
  
  
  router.get('/departments', async (req, res) => {
    try {
      // Connect to the SQL Server
      await sql.connect(config);
  
      // Get the value of @var from the query parameter
      const varValue = parseInt(req.query.var, 10);
  
      // Call the stored procedure based on the value of @var
      const result = await sql.query(
        `EXEC upcloud.Select_ALl_Department @var = ${varValue}`
      );
  
      // Return the result as JSON
      res.json(result.recordset);
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred.');
    } finally {
      // Close the SQL Server connection
      sql.close();
    }
  });
  
  // department get all data api ending
  
  
  
  // common status calling api starting here 
  router.get('/Commonstatus', async (req, res) => {
    try {
      // Connect to the SQL Server
      await sql.connect(config);
  
      // Get the value of @var from the query parameter
      const varValue = parseInt(req.query.var, 10);
  
      // Call the stored procedure based on the value of @var
      const result = await sql.query(
        `EXEC upcloud.Select_ALl_ComonStatus @var = ${varValue}`
      );
  
      // Return the result as JSON
      res.json(result.recordset);
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred.');
    } 
  
  });
  
  
  // common status calling api  ending
  
  
  
  
  
  
  
  // step1 forms data sumbit here starting api 
  
  
  // old api to get employee id step 0 
  
  router.post('/EmployeeLoginstep1', (req, res) => {
    const { username, Password, departmentID, IsActive, IsDisplay, createdBy } = req.body;
    console.log("step0", req.body);
  
    sql.connect(config)
      .then((pool) => {
        const request = pool.request();
        request.output('varOutput', sql.Int); // Correctly name the parameter as 'varOutput'
  
        return request
          .input('username', sql.VarChar(50), username)
          .input('password', sql.VarChar(50), Password)
          .input('departmentID', sql.VarChar(50), departmentID)
          .input('IsActive', sql.Bit, IsActive)
          .input('IsDisplay', sql.Int, IsDisplay)
          .input('createdBy', sql.Int, createdBy)
          .execute('upcloud.EmployeeLoginstep1');
      })
      .then((result) => {
        const varOutput = result.output.varOutput; // Access @varOutput as an OUTPUT parameter
        console.log('varOutput from stored procedure:', varOutput);
  
        if (varOutput === -1) {
          // Username already exists, and user data is returned by the stored procedure
          const userData = result.recordset; // Extract user data from the result
          res.status(200).json({ message: 'Username already exists', userData });
        } else if (varOutput !== -1) { // Change this condition
          // Registration inserted or updated successfully, and varOutput contains the ID or another relevant value
          res.status(201).json({ message: 'Registration inserted/updated successfully', varOutput });
        } else {
          // Handle other cases or errors here
          res.status(500).json({ error: 'Internal server error' });
        }
      })
      .catch((error) => {
        console.error('Error inserting/updating registration data:', error);
        res.status(500).json({ error: 'Internal server error' });
      });
  });
  
  
  router.get('/EmployeeLoginstepGetall', async (req, res) => {
    try {
      const pool = await sql.connect(config);
      const request = pool.request();
  
      // Execute the stored procedure to get all employee profiles
      const result = await request.execute('GetAllEmployeeSteplogin');
  
      res.status(200).json(result.recordset); // Send the retrieved data as JSON
    } catch (error) {
      console.error('Error retrieving data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // old api to get employeeid ending  step 0 
  
  
  
  
  
  // step1 forms data sumbit here ending api 
  
  
  // emp login step1   api starting here 
  // emp login step1   api starting here 
  router.post('/insertEmpInfo', (req, res) => {
    const { Defaultvar, EmployeeId, FullName, Age, MobileNumber, HomeAddress, Gender, DOB, MaratialStatus, CreatedBy } = req.body;
  
    // Add debugging statement to log parameters
    console.log('Executing stored procedure with parameters:', {
      Defaultvar,
      EmployeeId,
      FullName,
      Age,
      MobileNumber,
      HomeAddress,
      Gender,
      DOB,
      MaratialStatus,
     
    });
  
  
    sql.connect(config)
      .then((pool) => {
        const request = pool.request();
        request.input('var', sql.Int, Defaultvar) // Correct the parameter name here
          .input('EmployeeId', sql.Int, EmployeeId)
          .input('FullName', sql.VarChar(50), FullName)
          .input('Age', sql.Int, Age)
          .input('MobileNumber', sql.VarChar(50), MobileNumber)
          .input('HomeAddress', sql.VarChar(50), HomeAddress)
          .input('Gender', sql.VarChar(50), Gender)
          .input('DOB', sql.VarChar(50), DOB)
          .input('MaratialStatus', sql.VarChar(50), MaratialStatus)
          .input('CreatedBy', sql.Int, CreatedBy)
          // .output('InsertedID', sql.Int) // Declare an output parameter
          .execute('EmpInfoProcedure')
          .then((result) => {
            const insertedID = result.output.InsertedID; // Get the inserted ID from the output parameter
            res.status(201).json({ message: 'Data inserted successfully', insertedID });
          })
          .catch((error) => {
            console.error('Error executing stored procedure:', error);
            res.status(500).json({ error: 'Internal server error' });
          });
      })
      .catch((error) => {
        console.error('Error connecting to the database:', error);
        res.status(500).json({ error: 'Internal server error' });
      });
  });
  
  
  router.get('/getallempstep1', async (req, res) => {
   
    try {
      const pool = await checkDbConnection();
      if (pool) {
        const result = await pool
          .request()
          .input('EmployeeId', sql.Int, req.query.EmployeeId) // Assuming you're passing EmployeeId as a query parameter
          .execute('GetAllEmployeeStep1');
  
        res.status(200).json(result.recordset);
      } else {
        res.status(500).json({ error: 'Database connection failed' });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  
  // emp login step1   api ending here 
  // emp login step1   api ending here 
  
  
  
  
  // router.get('/getEmpPersonalInfo', (req, res) => {
  //   sql.connect(config)
  //     .then((pool) => {
  //       const request = pool.request();
  
  //       return request.execute('GetAllEmpPersonalInfo'); // Call the stored procedure
  //     })
  //     .then((result) => {
  //       res.status(200).json(result.recordset); // Send the result as JSON
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching data:', error);
  //       res.status(500).json({ error: 'Internal server error' });
  //     });
  // });
  // get api step1 staring here 
  
  
  
  
  
  
  
  
  
  // edit get api starting ending
  // get api step1 staring ending
  
  
  // emp login step1   api  ending
  
  
  //  step 2   api starting here 
  //  step 2   api starting here 
  //  step 2   api starting here 
  //  step 2   api starting here 
  
  // step 2 api starting here 
  // step 2 api starting here 
  // step 2 api starting here 
  // step 2 api starting here 
  // step 2 api starting here 
  router.post('/insertOrUpdateEmployeeStep2', (req, res) => {
  
    const {Deafultvar,
      EmployeeId,
      Streams,
      Place,
      Percentages,
      Years,
      CreatedBy
    } = req.body;
  
    sql.connect(config)
      .then((pool) => {
        const request = pool.request();
  
        request
        .input ('var', sql.Int, Deafultvar)
          .input('EmployeeId', sql.Int, EmployeeId)
          .input('Streams', sql.VarChar(50), Streams)
          .input('Place', sql.VarChar(50), Place)
          .input('Percentages', sql.VarChar(50), Percentages)
          .input('Years', sql.VarChar(50), Years)
          .input('CreatedBy', sql.Int, CreatedBy)
          .execute('EmpStep2', (error, result) => {
            if (error) {
              console.error('Error executing stored procedure:', error);
              res.status(500).json({ error: 'Internal server error' });
            } else {
              res.status(201).json({ message: 'Data inserted or updated successfully' });
            }
          });
      })
      .catch((error) => {
        console.error('Error connecting to the database:', error);
        res.status(500).json({ error: 'Internal server error' });
      });
  });
  
  
  
  router.get('/getallempstep2', async (req, res) => {
   
    try {
      const pool = await checkDbConnection();
      if (pool) {
        const result = await pool
          .request()
          .input('EmployeeId', sql.Int, req.query.EmployeeId) // Assuming you're passing EmployeeId as a query parameter
          .execute('GetAllEmployeeStep2');
  
        res.status(200).json(result.recordset);
      } else {
        res.status(500).json({ error: 'Database connection failed' });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // edit get api starting here 
  router.get('/getallempstepTwo/:id', async (req, res) => {
    const {id} = req.params
  
    try {
      await sql.connect(config);
  
      // Call the stored procedure with the provided id as a parameter
      const result = await new sql.Request()
        .input('id', sql.Int, id)
        .execute('GetEmployeeByIdstep2');
  
      if (result.recordset.length > 0) {
  
        res.json(result.recordset[0]);
      } else {
        res.status(404).json({ message: 'Data not found' });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal server error' });
    } 
  
  });
  
  
  router.delete('/deleteEducation/:id', async (req, res) => {
    const { id } = req.params;
    try {
      // Connect to the database
      await sql.connect(config);
  
      // Create a new Request object
      const request = new sql.Request();
  
      // Add a parameter for the stored procedure
      request.input('id', sql.Int, req.params.id);
  
      // Execute the stored procedure
      const result = await request.execute('DeleteEmployeeStep2ById');
  
      // Check if a message was returned by the stored procedure
      if (result.recordset.length > 0) {
        res.status(200).json({ message: result.recordset[0].Message });
      } else {
        res.status(404).json({ message: 'Education record not found' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    } finally {
      // Close the SQL Server connection
      await sql.close();
    }
  });
  //  step 2   api ending  here 
  //  step 2   api ending  here 
  //  step 2   api ending  here 
  //  step 2   api ending  here 
  
  
  
  // emp login step3   api starting 
  // emp login step3   api starting 
  // emp login step3   api starting 
  // emp login step3   api starting 
  
  
  router.post('/insertOrUpdateEmployeeStep3', (req, res) => {
   
    const {
      Defaultvar, // Assuming this is the row ID you want to update or 0 for insertion
      EmployeeId,
      Relation,
      FullName,
      AlternativeNumber,
      Address,
      CreatedBy
    } = req.body;
  
    sql.connect(config)
      .then((pool) => {
        const request = pool.request();
  
        request
          .input('var', sql.Int, Defaultvar) // Use '@var' instead of 'Deafultvar'
  
          .input('EmployeeId', sql.Int, EmployeeId)
          .input('Relation', sql.VarChar(50), Relation)
          .input('FullName', sql.VarChar(50), FullName)
          .input('AlternativeNumber', sql.VarChar(50), AlternativeNumber)
          .input('Address', sql.VarChar(50), Address)
          .input('CreatedBy', sql.Int, CreatedBy)
          .execute('EmpStep3', (error, result) => {
            if (error) {
              console.error('Error executing stored procedure:', error);
              res.status(500).json({ error: 'Internal server error' });
            } else {
              res.status(201).json({ message: 'Data inserted or updated successfully' });
            }
          });
      })
      .catch((error) => {
        console.error('Error connecting to the database:', error);
        res.status(500).json({ error: 'Internal server error' });
      });
  });
  
  
   router.get('/getallempstep3', async (req, res) => {
    try {
      const pool = await checkDbConnection();
      if (pool) {
        const result = await pool
          .request()
          .input('EmployeeId', sql.Int, req.query.EmployeeId) // Assuming you're passing EmployeeId as a query parameter
          .execute('GetAllEmpPersonalstep3');
  
        res.status(200).json(result.recordset);
      } else {
        res.status(500).json({ error: 'Database connection failed' });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  router.get('/getallempstepThree/:id', async (req, res) => {
    const {id} = req.params
  
    try {
      await sql.connect(config);
  
      // Call the stored procedure with the provided id as a parameter
      const result = await new sql.Request()
        .input('id', sql.Int, id)
        .execute('GetEmployeeByIdstep3');
  
      if (result.recordset.length > 0) {
  
        res.json(result.recordset[0]);
      } else {
        res.status(404).json({ message: 'Data not found' });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal server error' });
    } 
  
  });
  
  
  router.delete('/deleteEducationstep3/:id', async (req, res) => {
    const { id } = req.params;
    try {
      // Connect to the database
      await sql.connect(config);
  
      // Create a new Request object
      const request = new sql.Request();
  
      // Add a parameter for the stored procedure
      request.input('id', sql.Int, req.params.id);
  
      // Execute the stored procedure
      const result = await request.execute('DeleteEmployeeStep3ById');
  
      // Check if a message was returned by the stored procedure
      if (result.recordset.length > 0) {
        res.status(200).json({ message: result.recordset[0].Message });
      } else {
        res.status(404).json({ message: 'Education record not found' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    } 
   
  });
  // emp login step3   api ending
  // emp login step3   api ending
  // emp login step3   api ending
  // emp login step3   api ending
  
  
  
  // emp step 4 api sarting here 
  // emp step 4 api sarting here // ...
  
  
  
  // Your route for handling file upload and saving to the database
  router.post('/employeeStep4', upload.single('File'), async (req, res) => {
  
  
    try {
      const { EmployeeId, DocumentType, CreatedBy, Defaultvar } = req.body;
  
      // Check if a file was uploaded
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
  
      // Log the content of req.body.File
      console.log('File data:', req.file.buffer);
  
      // Call the EmpStep4 stored procedure
      sql.connect(config)
        .then((pool) => {
          const request = pool.request();
  
          request
            .input('EmployeeId', sql.Int, EmployeeId)
            .input('DocumentType', sql.NVarChar(50), DocumentType)
            .input('FilePath', sql.VarBinary(sql.MAX), req.file.buffer) // Use req.file.buffer
            .input('CreatedBy', sql.Int, CreatedBy)
            .input('var', sql.Int, Defaultvar) // Include Defaultvar
            .execute('EmpStep4', (error, result) => {
              if (error) {
                console.error('Error executing stored procedure:', error);
                res.status(500).json({ error: 'Internal server error' });
              } else {
                // Close the database connection
                sql.close();
  
                res.status(201).json({ message: 'Data inserted or updated successfully' });
              }
            });
        })
        .catch((err) => {
          console.error('Error connecting to the database:', err);
          res.status(500).json({ error: 'Internal Server Error' });
        });
    } catch (err) {
      console.error('Error calling the procedure:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  
  router.get('/getallempstep4', async (req, res) => {
    try {
      const pool = await checkDbConnection();
      if (pool) {
        const result = await pool
          .request()
          .input('EmployeeId', sql.Int, req.query.EmployeeId) // Assuming you're passing EmployeeId as a query parameter
          .execute('GetAllEmpPersonalstep4');
  
        res.status(200).json(result.recordset);
      } else {
        res.status(500).json({ error: 'Database connection failed' });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  router.get('/getallempstepFour/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      await sql.connect(config);
  
      // Call the stored procedure with the provided id as a parameter
      const result = await new sql.Request()
        .input('id', sql.Int, id) // Use id as is (a string)
        .execute('GetEmployeeByIdstep4');
  
      if (result.recordset.length > 0) {
        res.json(result.recordset[0]);
      } else {
        res.status(404).json({ message: 'Data not found' });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  
  router.delete('/deleteEducationstep4/:id', async (req, res) => {
    const { id } = req.params;
    try {
      // Connect to the database
      await sql.connect(config);
  
      // Create a new Request object
      const request = new sql.Request();
  
      // Add a parameter for the stored procedure
      request.input('id', sql.Int, req.params.id);
  
      // Execute the stored procedure
      const result = await request.execute('DeleteEmployeeStep4ById');
  
      // Check if a message was returned by the stored procedure
      if (result.recordset.length > 0) {
        res.status(200).json({ message: result.recordset[0].Message });
      } else {
        res.status(404).json({ message: 'Education record not found' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    } 
   
  });
  
  // emp step 4 api ending
  // emp step 4 api  ending
  // emp step 4 api  ending
  // emp step 4 api  ending
  
  
  
  
  
  
  // emp step 5 api starting here 
  // emp step 5 api starting here 
  
  
  
  router.post('/insertOrUpdateEmployeeStep5', (req, res) => {
  
      const {Deafultvar,
        CreatedBy,
        EmployeeId,
        BankName,
        BranchName,
        AccountNumber,
        IFSCCode,
      } = req.body;
    
      sql.connect(config)
        .then((pool) => {
          const request = pool.request();
    
          request
          .input ('var', sql.Int, Deafultvar)
          .input('CreatedBy', sql.Int, CreatedBy)
          .input('EmployeeId', sql.Int, EmployeeId)
          .input('BankName', sql.VarChar(50), BankName)
          .input('BranchName', sql.VarChar(50), BranchName)
          .input('AccountNumber', sql.VarChar(50), AccountNumber)
          .input('IFSCCode', sql.VarChar(50), IFSCCode)
        
            .execute('EmpStep5', (error, result) => {
              if (error) {
                console.error('Error executing stored procedure:', error);
                res.status(500).json({ error: 'Internal server error' });
              } else {
                res.status(201).json({ message: 'Data inserted or updated successfully' });
              }
            });
        })
        .catch((error) => {
          console.error('Error connecting to the database:', error);
          res.status(500).json({ error: 'Internal server error' });
        });
    });
    
  router.get('/getallempstep5', async (req, res) => {
    try {
      const pool = await checkDbConnection();
      if (pool) {
        const result = await pool
          .request()
          .input('EmployeeId', sql.Int, req.query.EmployeeId) // Assuming you're passing EmployeeId as a query parameter
          .execute('GetAllEmpPersonalstep5');
  
        res.status(200).json(result.recordset);
      } else {
        res.status(500).json({ error: 'Database connection failed' });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // edit get api starting here 
  router.get('/getallempstepFive/:id', async (req, res) => {
    const {id} = req.params
  
    try {
      // await sql.connect(config);
  
      // Call the stored procedure with the provided id as a parameter
      const result = await new sql.Request()
        .input('id', sql.Int, id)
        .execute('GetEmployeeByIdstep5');
  
      if (result.recordset.length > 0) {
  
        res.json(result.recordset[0]);
      } else {
        res.status(404).json({ message: 'Data not found' });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal server error' });
    } 
  
  });
  
  
  router.delete('/deleteEducationstep5/:id', async (req, res) => {
   
    try {
      // Connect to the database
      await sql.connect(config);
  
      // Create a new Request object
      const request = new sql.Request();
  
      // Add a parameter for the stored procedure
      request.input('id', sql.Int, req.params.id);
  
      // Execute the stored procedure
      const result = await request.execute('DeleteEmployeeStep5ById');
  
      // Check if a message was returned by the stored procedure
      if (result.recordset.length > 0) {
        res.status(200).json({ message: result.recordset[0].Message });
      } else {
        res.status(404).json({ message: 'Education record not found' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    } 
   
  });
  // emp step 5 api starting ending
  // emp step 5 api starting ending
  
  
  
  
  
  
  // login api starting here 
  
  router.post('/AllLogin', async (req, res) => {
   
    try {
      const { username, password } = req.body; // Use 'Password' here
  
      const pool = await sql.connect(config);
      const request = pool.request();
  
      // Call the stored procedure to insert data into the table
      const result = await request
        .input('username', sql.VarChar(50), username)
        .input('password', sql.VarChar(50), password) // Use 'Password' here
        .execute('Get_Employee_Login');
  
      // Get the data returned from the stored procedure
      const userData = result.recordset[0]; // Assuming your data is in the first record
  
      // Send all user data in the response
      res.status(201).json({
        message: 'Registration inserted successfully',
        userData,
      });
    } catch (error) {
      console.error('Error inserting registration data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  
  // login api starting ending
  
  
  router.get('/dummy',(req,res)=>{
    res.send('Hello World!'); 
    res.end(); 
      })



  // sendemail function starting here 
  // sendemail function starting here 
  // sendemail function starting here 
  // sendemail function starting here 
  router.post('/insert-list-user', async (req, res) => {
    console.log(req.body);
    try {
      const { Defaultvar, Name, UserId } = req.body;
  
      // Check if Name or UserId is blank
      if (!Name || !UserId) {
        return res.status(400).json({ error: 'Please enter a name and user ID' });
      }
  
      const pool = await sql.connect(config);
      const request = pool.request();
  
      // Call the stored procedure to insert or update data in the ListUserName table
      await request
        .input('var', sql.Int, Defaultvar)
        .input('Name', sql.VarChar(50), Name)
        .input('UserId', sql.Int, UserId)
        .execute('ListUser_Name');
  
      res.status(201).json({ message: 'Data inserted or updated successfully' });
    } catch (error) {
      console.error('Error inserting or updating data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  router.get('/listusernames', async (req, res) => {
    try {
      const pool = await sql.connect(config);
      const request = pool.request();
      
      const result = await request.query('EXEC GetListUserNames');
  
      res.json(result.recordset); // This sends the result as JSON
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


  // sendemail function starting ending
  // sendemail function starting ending
  // sendemail function starting ending
  // sendemail function starting ending




module.exports = router;