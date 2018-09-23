import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { saveLightVolume } from '../../redux/actions/lightActions'
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import MaterialRenderTextField from '../../Utils/MaterialRenderTextField';

const styles = theme => ({
    layout: {
      width: 'auto',
      display: 'block', // Fix IE11 issue.
      marginTop: theme.spacing.unit * 8,
      marginLeft: theme.spacing.unit * 3,
      marginRight: theme.spacing.unit * 3,
      [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
        width: 300,
        marginLeft: 'auto',
        marginRight: 'auto',
      },
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

class SettingLightVolume extends Component {

    componentDidMount() {
        //เรียกใช้ฟังก์ชันในการก�ำหนด value ให้กับ textbox และ control ต่างๆ
        this.handleInitialize()
    }

    handleInitialize() {
        let initData = {
            "greenHouseId": 789456123,
            "maxLightVolume": this.props.maxConfig,
        };
        this.props.initialize(initData);
    }

    render() {
        const { classes,handleSubmit } = this.props

        return (
            <React.Fragment>
            <CssBaseline />
            <main className={classes.layout}>
                <Typography variant="headline">ปริมาณแสงที่ต้องการต่อวัน</Typography>
                <form className={classes.form}>
                  <FormControl margin="normal" required fullWidth>
                    <Field name="maxLightVolume"  component={MaterialRenderTextField} type='number' label="ปริมาณแสงที่ต้องการต่อวัน(ชม.)" />
                  </FormControl>
                  <Button
                    type="submit"
                    fullWidth
                    variant="raised"
                    color="primary"
                    className={classes.submit}
                    onClick={handleSubmit(this.onSubmit)}
                  >
                    บันทึก
                  </Button>
                </form>
            </main>
            </React.Fragment>
        )
    }


    onSubmit = (values) => {
        //เมื่อบันทึกข้อมูลเสร็จสังให้ไปยัง route /
        this.props.dispatch(saveLightVolume(values)).then(() => {
            this.props.onToggle()
        })
    }
}


function validate(values) {
    const errors = {};
    let min = parseFloat(values.minLightVolume)
    let max = parseFloat(values.maxLightVolume)

    if (values.minLightVolume === "") {
        errors.maxLightVolume = 'ต้องกรอกปริมาณแสงที่ต้องการ';
    }else if(min < 0 || min > 60 ){
        errors.maxLightVolume = 'ปริมาณแสงที่ต้องการต้องอยู่ในช่วง 0-24 ชม.';
    }
    return errors;
}

const form = reduxForm({
    form: 'settingLightVolume',
    validate
})

export default withStyles(styles)(form(SettingLightVolume));