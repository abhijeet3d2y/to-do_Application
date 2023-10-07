const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index.js'); // Import your Express app

chai.use(chaiHttp);
const expect = chai.expect;

describe('To-Do API', () => {
  // Variables to hold IDs of created To-Do items for testing update and delete
  let createdTodoId;

  // Test creating a new To-Do item
  it('should create a new To-Do item', (done) => {
    chai
      .request(app)
      .post('/todos')
      .send({ title: 'Test To-Do', description: 'Test description', status: 'Incomplete' })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        expect(res.body.title).to.equal('Test To-Do');
        createdTodoId = res.body.id; // Store the created To-Do ID for future tests
        done();
      });
  });

  // Test retrieving all To-Do items
  it('should retrieve a list of all To-Do items', (done) => {
    chai
      .request(app)
      .get('/todos')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  // Test retrieving a single To-Do item by its ID
  it('should retrieve a single To-Do item by its ID', (done) => {
    chai
      .request(app)
      .get(`/todos/${createdTodoId}`) // Use the ID of the created To-Do item
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.id).to.equal(createdTodoId); // Ensure the correct ID is retrieved
        done();
      });
  });

  // Test updating a To-Do item
  it('should update a To-Do item', (done) => {
    chai
      .request(app)
      .put(`/todos/${createdTodoId}`) // Use the ID of the created To-Do item
      .send({ title: 'Updated To-Do', description: 'Updated description', status: 'Completed' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.title).to.equal('Updated To-Do');
        done();
      });
  });

  // Test deleting a To-Do item
  it('should delete a To-Do item', (done) => {
    chai
      .request(app)
      .delete(`/todos/${createdTodoId}`) // Use the ID of the created To-Do item
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.equal('To-Do item deleted successfully');
        done();
      });
  });
});