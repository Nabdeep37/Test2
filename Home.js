import React from 'react';
import LeftImage from './../hero-right.jpg'

const Home = () => {
  return (
    <div>
        <div className='container'>
            <div className='row'>

                <div className='hero-left col-md-6'>
                    <h2>Welcome to <span className='hero-logo'>National Bank</span></h2>
                    <p>Feel free to adjust the wording or styling based on your specific needs or branding guidelines. This banner text is designed to be clear and enticing, highlighting the benefit of opening a bank account with the promise of a $200 CAD bonus upon joining.</p>
                    <br></br>
                    <p>We’re Canada's 6th largest bank and the leading one in Quebec. But above all, we’re a bank with a human touch that stands out for its bold approach, entrepreneurial spirit, and passion for people.</p>
                    <br></br>
                    <h3>Our Common Goal</h3>
                    <p>Since we began in 1859, we've been here to make a positive impact on people's lives. Our strategy? Building long-term relationships with our clients, teams, shareholders, and our community.</p>
                    <br></br>
                    <button className="hero-button cbtn btn-primary">let's go! for bright future</button>
                </div>
                <div className='col-md-6'>
                    <img src={LeftImage}/>
                </div>
            </div>

            <BodyArea/>


            
           
        </div>
      
    </div>
  );
};


const BodyArea = () => {
    return (
       
            <div className='row'>

            

                <div className='body-content col-md-4'>

                    <h3>Empowerment</h3>
                    <p>Each of us has the ability to make a difference. It is up to us to take action.</p>
                </div>

            <div className='body-content col-md-4'>

            <h3>Partnership</h3>
            <p>We work as a team to make a positive impact.</p>
            </div>

            <div className='body-content col-md-4'>

            <h3>Agility</h3>
            <p>We always adapt quickly to changes in society and in the lives of our customers.</p>
             
            </div>

          


            </div>

       
    );
}

export default Home;
