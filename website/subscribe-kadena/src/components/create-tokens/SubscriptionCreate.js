import React, {useState, useEffect} from 'react'
import axios from 'axios'
import "./ProviderTokenCreationSection.css"

function SubscriptionCreate() {
    const [formInput, updateFormInput] = useState({
        name:"",
        provider:"",
        provider_guard:"",
        description:"",
    })
    const createSubscription = async (options)=>{
      const parsedOptions = {...options, provider_guard : JSON.parse(options.provider_guard)} 
      try{
        axios.post(`${process.env.REACT_APP_SUBSCRIPTION_API}/subscription/create`, parsedOptions).then((res)=>{
          console.log(res)
        })
      }catch(e){
        console.log(e)
      }
    }
  return (
    <div className = "createContainer">

      <section
        className="jumbotron breadcumb no-bg"
        style={{ backgroundImage: `url(${"./img/background/subheader.jpg"})` }}
      >
        <div className="mainbreadcumb">
          <div className="container">
            <div className="row m-10-hor">
              <div className="col-12">
                <h1 className="text-center">Create Subscription</h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container">
        <div className="row">
          <div className="col-lg-7 offset-lg-1 mb-5">
            <form id="form-create-item" className="form-border" action="#">
              <div className="field-set">
                <h5>Name</h5>
                <input
                  type="text"
                  name="item_title"
                  id="item_title"
                  className="form-control"
                  placeholder="e.g. 'Crypto Funk"
                  onChange={(e) =>
                    updateFormInput({ ...formInput, name: e.target.value })
                  }
                />
                 <div className="spacer-10"></div>

                <h5>Description</h5>
                <textarea
                  data-autoresize
                  name="item_desc"
                  id="item_desc"
                  className="form-control"
                  placeholder="e.g. 'This is very limited item'"
                  onChange={(e) =>
                    updateFormInput({
                      ...formInput,
                      description: e.target.value,
                    })
                  }
                ></textarea>

                <div className="spacer-10"></div>
                
                <h5>Interval</h5>
                <input
                  type="number"
                  name="item_quantity"
                  id="item_quantity"
                  className="form-control"
                  placeholder="Interval in Days"
                  onChange={(e) =>
                    updateFormInput({ ...formInput, interval: e.target.value })
                  }
                />

                <div className="spacer-10"></div>

                <h5>Provider Royalties</h5>
                <input
                  type="number"
                  name="item_royalty"
                  id="item_royalty"
                  className="form-control"
                  placeholder="KDA"
                  onChange={(e) =>
                    updateFormInput({ ...formInput, royalty: e.target.value })
                  }
                />
                <h5>Price</h5> 
                <input
                  type="number"
                  name="item_royalty"
                  id="item_royalty"
                  className="form-control"
                  placeholder="KDA"
                  onChange={(e) =>
                    updateFormInput({ ...formInput, price: e.target.value })
                  }
                />
                <div className="spacer-10"></div>

                <h5>Provider Info</h5>
                <input
                  type="text"
                  name="item_royalty"
                  id="item_royalty"
                  className="form-control"
                  placeholder="Provider Account"
                  onChange={(e) =>
                    updateFormInput({ ...formInput, provider: e.target.value })
                  }
                />
                <input
                  type="text"
                  name="item_royalty"
                  id="item_royalty"
                  className="form-control"
                  placeholder="Provider Guard"
                  onChange={(e) =>
                    updateFormInput({ ...formInput, provider_guard: e.target.value })
                  }
                />
                <div></div>
                <button
                  type="button"
                  id="submit"
                  className={
                     "btn-main"
                  }
                  whileHover={
                   { scale: 1.1 }
                  }
                  whileTap={{ scale: 0.9 }}
                  onClick={
                     ()=>createSubscription(formInput)
                  }
                >
                  Create NFT
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}

export default SubscriptionCreate