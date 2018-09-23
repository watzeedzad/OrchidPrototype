import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { saveHumidityConfig } from '../../redux/actions/weatherActions'
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
      [theme.breakpoints.up(250 + theme.spacing.unit * 3 * 2)]: {
        width: 250,
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

class SettingHumidity extends Component {

    componentDidMount() {
        //เรียกใช้ฟังก์ชันในการก�ำหนด value ให้กับ textbox และ control ต่างๆ
        this.handleInitialize()
    }

    handleInitialize() {
        let initData = {
            "greenHouseId": 789456123,
            "minHumidity": this.props.minConfig,
            "maxHumidity": this.props.maxConfig,
        };
        this.props.initialize(initData);
    }

    render() {
        const { classes,handleSubmit } = this.props

        return (
            <React.Fragment>
            <CssBaseline />
            <main className={classes.layout}>
                <Typography variant="headline">ตั้งค่าความชื้นที่เหมาะสม</Typography>
                <form className={classes.form}>
                  <FormControl margin="normal" required fullWidth>
                    <Field name="minHumidity"  component={MaterialRenderTextField} type='number' label="ความชื้นต่ำสุด" />
                  </FormControl>
                  <FormControl margin="normal" required fullWidth>
                  <Field name="maxHumidity" component={MaterialRenderTextField} type="number" label="ความชื้นสูงสุด" />
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
        this.props.dispatch(saveHumidityConfig(values)).then(() => {
            this.props.onToggle()
        })
    }
}


function validate(values) {
    const errors = {};
    let min = parseFloat(values.minHumidity)
    let max = parseFloat(values.maxHumidity)

    if (values.minHumidity === "") {
        errors.minHumidity = 'ต้องกรอกความชื้นต่ำสุด';
    }else if(min < 0 || min > 100 ){
        errors.minHumidity = 'ความชื้นต้องอยู่ระหว่าง 0 - 100 ';
    }
    if (values.maxHumidity === "") {
        errors.maxHumidity = 'ต้องกรอกความชื้นสูงสุด';
    }else if(max < 0 || max > 100 ){
        errors.maxHumidity = 'ความชื้นต้องอยู่ระหว่าง 0 - 100 ';
    }
    if(min > max ){
        errors.minHumidity = 'ความชื้นต่ำสุดต้องน้อยกว่าสูงสุด';
    }
    return errors;
}

const form = reduxForm({
    form: 'settingHumidity',
    validate
})

export default withStyles(styles)(form(SettingHumidity));