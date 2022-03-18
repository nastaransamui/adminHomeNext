import userStyle from '../SideBar/user-style';
import PropTypes from 'prop-types';

export default function User(props) {
  const { _id } = props;
  const classes = userStyle();
  return <div>User {_id}</div>;
}

User.propTypes = {
  _id: PropTypes.string.isRequired,
};
