import { useState } from "react";

const Body = ({ staffs, tipper }) => {
  const [tip, setTip] = useState("");

  const submitTip = (index)=>{
      if(!tip)return;
      tipper(index, tip)
  }

  return (
    <>
      <main>
        <div className="row row-cols-1 row-cols-md-3 mb-3 text-center">
          {staffs.map((staff) => (
            <div className="col">
              <div className="card mb-4 rounded-3 shadow-sm border-primary">
                <div className="card-header py-3 text-white bg-primary border-primary">
                  <h4 className="my-0 fw-normal">{staff.owner}</h4>
                </div>
                <div className="card-body">
                  <h1 className="card-title pricing-card-title">
                    ${staff.totalAmount / 10 ** 18}
                    <small className="text-muted fw-light">/tipped</small>
                  </h1>
                  <ul className="list-unstyled mt-3 mb-4">
                    <li>
                      <img src={staff.image} width={100} height={100} alt="" />
                    </li>
                    <li>{staff.name}</li>
                    <li>{staff.bio}</li>
                    <li>{staff.jobDescription}</li>
                  </ul>
                  <div className="row">
                    <div className="col-8">
                      <input
                        className="form-control w-100"
                        type="number"
                        placeholder="Tip"
                        onChange={(e) => setTip(e.target.value)}
                      />
                    </div>
                    <div className="col-4">
                      <button
                        type="button"
                        onClick={()=>submitTip(staff.index)}
                        className="w-100 btn btn-sm btn-primary"
                      >
                        Tip
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
};

export default Body;
