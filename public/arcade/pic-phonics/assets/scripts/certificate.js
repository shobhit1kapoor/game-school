/* jshint esversion: 8 */

/** Retrieves the data from the input values in the results container that were stored in local storage
 * It uses this data to populate the certificate HTML with personalised name and score for each user
 */
        if (localStorage.getItem('fname') && (localStorage.getItem('lname'))) {
           document.getElementById('name').innerHTML = localStorage.getItem('fname') + " " + localStorage.getItem('lname');
           document.getElementById('certScore').innerHTML = "with a total score of" + " " + localStorage.getItem('score') + "%";
        } else {
            let defaultVal = 'This Superstar';
            let defaultScore = 'Well Done!';
            document.getElementById('name').innerHTML = defaultVal;
            document.getElementById('certScore').innerHTML = defaultScore;
        }

    