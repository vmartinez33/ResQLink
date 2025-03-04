import BtnSendAlert from '@/components/BtnSendAlert';
import Map from '@/components/UserMap';

const UserView = ({ user }) => {
	return (
		<div className='content-view'>
			<div id='map'>
				<Map user={user} />
			</div>
			<div id='user-alert'>
				<BtnSendAlert user={user} />
			</div>
		</div>
	);
};

export default UserView;
