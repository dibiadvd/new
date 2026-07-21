// ========== AUTHENTICATION UTILITIES ==========

/**
 * Check if user is logged in and redirect to login if not
 */
function checkAuthStatus(redirectUrl = 'login.html') {
  firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
      window.location.href = redirectUrl;
    }
  });
}

/**
 * Get current logged-in user
 */
function getCurrentUser(callback) {
  firebase.auth().onAuthStateChanged((user) => {
    callback(user);
  });
}

/**
 * Register a new user with email and password
 */
function registerUser(email, password, userData, callback) {
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const uid = userCredential.user.uid;
      
      // Save additional user data to database
      const userRef = firebase.database().ref('users/' + uid);
      userRef.set({
        email: email,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        ...userData // Include registration form data
      }).then(() => {
        callback(true, 'Registration successful');
      }).catch((error) => {
        callback(false, 'Error saving user data: ' + error.message);
      });
    })
    .catch((error) => {
      callback(false, error.message);
    });
}

/**
 * Login user with email and password
 */
function loginUser(email, password, callback) {
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const uid = userCredential.user.uid;
      
      // Update last login
      firebase.database().ref('users/' + uid).update({
        lastLogin: new Date().toISOString()
      });
      
      callback(true, 'Login successful');
    })
    .catch((error) => {
      callback(false, error.message);
    });
}

/**
 * Logout user
 */
function logoutUser(callback) {
  firebase.auth().signOut()
    .then(() => {
      callback(true, 'Logged out successfully');
    })
    .catch((error) => {
      callback(false, error.message);
    });
}

/**
 * Get user profile data from database
 */
function getUserProfile(uid, callback) {
  firebase.database().ref('users/' + uid).once('value', (snapshot) => {
    callback(snapshot.val());
  });
}

/**
 * Update user profile data
 */
function updateUserProfile(uid, profileData, callback) {
  firebase.database().ref('users/' + uid).update(profileData)
    .then(() => {
      callback(true, 'Profile updated successfully');
    })
    .catch((error) => {
      callback(false, error.message);
    });
}

/**
 * Save transaction to user's transaction history
 */
function addTransaction(uid, transactionData, callback) {
  const transactionRef = firebase.database().ref('transactions/' + uid).push();
  transactionRef.set({
    timestamp: new Date().toISOString(),
    ...transactionData
  }).then(() => {
    callback(true, transactionRef.key);
  }).catch((error) => {
    callback(false, error.message);
  });
}

/**
 * Get all transactions for a user
 */
function getUserTransactions(uid, limit = 20, callback) {
  firebase.database().ref('transactions/' + uid)
    .orderByChild('timestamp')
    .limitToLast(limit)
    .once('value', (snapshot) => {
      const transactions = [];
      snapshot.forEach((child) => {
        transactions.unshift({
          id: child.key,
          ...child.val()
        });
      });
      callback(transactions);
    });
}

/**
 * Real-time listener for user transactions
 */
function listenToUserTransactions(uid, callback) {
  firebase.database().ref('transactions/' + uid)
    .orderByChild('timestamp')
    .limitToLast(10)
    .on('value', (snapshot) => {
      const transactions = [];
      snapshot.forEach((child) => {
        transactions.unshift({
          id: child.key,
          ...child.val()
        });
      });
      callback(transactions);
    });
}

/**
 * Update account balance
 */
function updateAccountBalance(uid, accountType, newBalance, callback) {
  const balanceData = {};
  balanceData['accountBalances/' + accountType] = newBalance;
  
  firebase.database().ref('users/' + uid).update(balanceData)
    .then(() => {
      callback(true, 'Balance updated');
    })
    .catch((error) => {
      callback(false, error.message);
    });
}

/**
 * Get account balance
 */
function getAccountBalance(uid, accountType, callback) {
  firebase.database().ref('users/' + uid + '/accountBalances/' + accountType)
    .once('value', (snapshot) => {
      callback(snapshot.val() || 0);
    });
}
