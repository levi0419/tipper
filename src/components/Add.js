import { useState } from "react";

const Add = ({add}) => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [image, setImage] = useState("");
  const [bio, setBio] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const formHandler = (e)=>{
      e.preventDefault();
      add({name, image, age, bio, jobDescription});
  }


  return (
    <>
      <div className="row">
        <h2>Add your staff</h2>
        <form onSubmit={formHandler} className="col-6">
          <div className=" mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Name"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Age"
              onChange={(e) => setAge(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Image"
              onChange={(e) => setImage(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <textarea
              type="text"
              className="form-control"
              placeholder="Bio"
              onChange={(e) => setBio(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <textarea
              type="text"
              className="form-control"
              placeholder="Job Description"
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
    </>
  );
};

export default Add;
