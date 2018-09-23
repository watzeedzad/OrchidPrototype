import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { saveLightIntensity } from '../../redux/actions/lightActions'
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

class SettingLightIntensity extends Component {

    componentDidMount() {
        //เรียกใช้ฟังก์ชันในการก�ำหนด value ให้กับ textbox และ control ต่างๆ
        this.handleInitialize()
    }

    handleInitialize() {
        let initData = {
            "greenHouseId": 789456123,
            "minLightIntensity": this.props.minConfig,
            "maxLightIntensity": this.props.maxConfig,
        };
        this.props.initialize(initData);
    }

    render() {
        const { classes,handleSubmit } = this.props

        return (
            <React.Fragment>
            <CssBaseline />
            <main className={classes.layout}>
                <Typography variant="headline">ตั้งค่าความเข้มแสง</Typography>
                <form className={classes.form}>
                  <FormControl margin="normal" required fullWidth>
                    <Field name="minLightIntensity"  component={MaterialRenderTextField} type='number' label="ความเข้มแสงต่ำสุด" />
                  </FormControl>
                  <FormControl margin="normal" required fullWidth>
                  <Field name="maxLightIntensity" component={MaterialRenderTextField} type="number" label="ความเข้มแสงสูงสุด" />
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
        this.props.dispatch(saveLightIntensity(values)).then(() => {
            this.props.onToggle()
        })
    }
}


function validate(values) {
    const errors = {};
    let min = parseFloat(values.minLightIntensity)
    let max = parseFloat(values.maxLightIntensity)

    if (values.minLightIntensity === "") {
        errors.minLightIntensity = 'ต้องกรอกความเข้มแสงต่ำสุด';
    }else if(min < 0 || min > 60 ){
        errors.minLightIntensity = 'ความเข้มแสงต้องอยู่ระหว่าง 0 - 100 ';
    }
    if (values.maxLightIntensity === "") {
        errors.maxLightIntensity = 'ต้องกรอกความเข้มแสงสูงสุด';
    }else if(max < 0 || max > 60 ){
        errors.maxLightIntensity = 'ความเข้มแสงต้องอยู่ระหว่าง 0 - 100 ';
    }
    if(min > max ){
        errors.minLightIntensity = 'ความเข้มแสงต่ำสุดต้องน้อยกว่าสูงสุด';
    }
    return errors;
}

const form = reduxForm({
    form: 'settingLightIntensity',
    validate
})

export default withStyles(styles)(form(SettingLightIntensity));