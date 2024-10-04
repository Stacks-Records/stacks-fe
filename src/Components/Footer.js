import '../CSS/Footer.css'
import github from '../Images/github-icon.png'
import linkedin from '../Images/linkedin-icon.png'

function Footer() {
    return (
        <footer className="footer">
            <h2 className="created-by">Created by:</h2>
            <div className="info-section">
                <div className="person">
                    <h3 className="name">Kyle Boomer</h3>
                    <img src={github} className="github" alt="Github Logo" />
                    <a href='https://www.github.com/kylemboomer' className="github-link">@Github</a>
                    <img src={linkedin} className="linkedin" alt="LinkedIn Logo" /> 
                    <a href='https://www.linkedin.com/in/kylemboomer' className='linkedin-link'>@LinkedIn</a>
                </div>
            </div>
        </footer>
    )
}

export default Footer