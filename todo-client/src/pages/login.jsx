import './Login.css'
import { FcGoogle } from "react-icons/fc";
import illustration1 from '../images/undraw_schedule_ry1w.svg';
import illustration2 from '../images/undraw_mind-map_i9bv.svg';

function Login({ onLogin }) {
	return (
		<div className="login-page">
            <div className="logo">ToDo</div>
			<div className="login-card">
				<div className="illustration">
					<img src={illustration1} alt="Schedule" />
					<img src={illustration2} alt="Mind map" />
				</div>

				<h3>Organize your workflow!</h3>

				<button type="button" className="login-btn" onClick={onLogin}>
                    <FcGoogle size={24} /> Continue with Google
				</button>

				<p className="terms-copy">
					<a href="https://anupbhattarai2.com.np/" target="_blank" rel="noreferrer">
						Terms and Conditions
					</a>
				</p>
			</div>
		</div>
	)
}

export default Login
