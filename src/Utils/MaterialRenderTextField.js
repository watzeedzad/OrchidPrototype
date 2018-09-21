import React from 'react';
import TextField from '@material-ui/core/TextField';

const MaterialRenderTextField = ({input,label,meta:{touched,error},...custom}) =>(

    <TextField
        label={label}
        floatingLabelText={label}
        errorText={touched && error}
        {...input}
        {...custom}
    />
)

export default MaterialRenderTextField;