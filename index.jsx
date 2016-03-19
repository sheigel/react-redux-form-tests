import React, {Component, PropTypes} from 'react';
import {render} from 'react-dom';
import {reduxForm, reducer as formReducer} from 'redux-form';
import { createStore } from 'redux'
import {connect} from 'react-redux'
import { Provider } from 'react-redux'
import { combineReducers } from 'redux'

export const fields = ['username', 'email', 'age'];

const validate = values => {
    const errors = {};
    if (!values.username) {
        errors.username = 'Required';
    } else if (values.username.length > 15) {
        errors.username = 'Must be 15 characters or less';
    }
    if (!values.email) {
        errors.email = 'Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid email address';
    }
    if (!values.age) {
        errors.age = 'Required';
    } else if (isNaN(Number(values.age))) {
        errors.age = 'Must be a number';
    } else if (Number(values.age) < 18) {
        errors.age = 'Sorry, you must be at least 18 years old';
    }
    return errors;
};

class SynchronousValidationForm extends Component {

    render() {

        const {fields: {username, email, age}, resetForm, handleSubmit, submitting} = this.props;
        return (<form onSubmit={handleSubmit}>
            <div>
                <label>Username</label>
                <div>
                    <input type="text" placeholder="Username" {...username}/>
                </div>
                {username.error && <div>{username.error}</div>}
            </div>
            <div>
                <label>Email</label>
                <div>
                    <input type="text" placeholder="Email" {...email}/>
                </div>
                {email.touched && email.error && <div>{email.error}</div>}
            </div>
            <div>
                <label>Age</label>
                <div>
                    <input type="text" placeholder="Age" {...age}/>
                </div>
                {age.touched && age.error && <div>{age.error}</div>}
            </div>
            <div>
                <button type="submit" disabled={submitting}>
                    {submitting ? <i/> : <i/>} Submit
                </button>
                <button type="button" disabled={submitting} onClick={resetForm}>
                    Clear Values
                </button>
            </div>
        </form>
        );
    }
}

function counter(state = 0, action) {
    switch (action.type) {
        case 'INCREMENT':
            return state + 1
        case 'DECREMENT':
            return state - 1
        default:
            return state
    }
}

const store = createStore(combineReducers({
    counter,
    form: formReducer,
    submitForm: (state = {},action) => {
        console.log('called reducer',state,action);
        return state;
    }
}))

const Formul = reduxForm({
    form: 'form',
    fields,
    validate,
    onSubmit: ()=>{
        
    }
}
// , null, ()=>{
//     return {
//         onSubmit: (fields,dispatch) => {
//             console.log('called mapped props',fields)
//             return dispatch({type:'fuck'});
//         }, onSubmit1: () => {
//             console.log('called mapped props')
//             return {action:'fuck'};
//         },
//         fu:'ck',
//         handleSubmit:()=>{
//             console.log("called handleSubmit")
//         }
// }}
)(SynchronousValidationForm);

const Wrapper = connect()(class WrapperPage extends React.Component {
    render() {
        return <div>
            {this.props.children}
        </div>
    }
})

const el = document.querySelector("#myApp");
console.log(el);



render((
    <Provider store={store}>
        <Wrapper>
            <Formul handleSubmit={console.log('called Formul handler') }/>
        </Wrapper>
    </Provider>
), el);
