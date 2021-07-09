const { assert } = require('chai');
const {checkingObjectEmails} = require("../helperFunc");




const testUsers = {
    "userRandomID": {
      id: "userRandomID", 
      email: "user@example.com", 
      password: "purple-monkey-dinosaur"
    },
    "user2RandomID": {
      id: "user2RandomID", 
      email: "user2@example.com", 
      password: "dishwasher-funk"
    }
  };


  describe('getUserByEmail', function() {
    it('should return true if the email exists', function() {
      const user = checkingObjectEmails("user@example.com", testUsers);
      const expectedOutput = true;
      assert.equal(user, expectedOutput);
    });

    it("it should return undefined if the email does not exist", () => {
        const user = checkingObjectEmails("false@email.com", testUsers);
        const expectedOutput = undefined;
        assert.equal(user, expectedOutput);
    })
  });