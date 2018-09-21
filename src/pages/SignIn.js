import React,{Component}from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import MaterialRenderTextField from '../Utils/MaterialRenderTextField';
import { login } from '../redux/actions/loginActions';

const styles = theme => ({
  layout: {
    width: 'auto',
    display: 'block', // Fix IE11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },

  headName:{
    margin: theme.spacing.unit,
  }

});

class SignIn extends Component {

    render(){

        const { classes,handleSubmit } = this.props;
        return (
            <React.Fragment>
              <CssBaseline />
              <main className={classes.layout}>
                <Paper className={classes.paper}>
                  <Typography variant="headline">Orchidcare Prototype System</Typography>
                  <form className={classes.form}>
                    <FormControl margin="normal" required fullWidth>
                      <Field component={MaterialRenderTextField}  label="ชื่อผู้ใช้"  name="username" type='text' />
                    </FormControl>
                    <FormControl margin="normal" required fullWidth>
                    <Field name="password" component={MaterialRenderTextField} type="password" label="รหัสผ่าน" />
                    </FormControl>
                    <Button
                      type="submit"
                      fullWidth
                      variant="raised"
                      color="primary"
                      className={classes.submit}
                      onClick={handleSubmit(this.onSubmit)}
                    >
                      เข้าสู่ระบบ
                    </Button>
                  </form>
                </Paper>
              </main>
            </React.Fragment>
          );
        }

        onSubmit = (values) => {
            //เมื่อบันทึกข้อมูลเสร็จสังให้ไปยัง route /
            console.log(values)
            this.props.dispatch(login(values))
        }
         
}


SignIn.propTypes = {
    classes: PropTypes.object.isRequired,
  };       
   

function validate(values) {
    const errors = {};
    if (!values.username) {
        errors.username = 'กรุณากรอก username';
    }
    if (!values.password) {
        errors.password = 'กรุณากรอก password';
    }
    return errors;
}

const form = reduxForm({
    form: 'signIn',
    validate
})

function mapStateToProps(state) {
    return {
        // errorMessage: state.loginReducers.error //กรณี Signin ไม่ผ่าน
    }
}


export default connect(mapStateToProps) (withStyles(styles)(form(SignIn)));