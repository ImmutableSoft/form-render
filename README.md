# Getting Started

FormAlly form renderer of JSON form definition created by
@immutablesoft/form-edit for ReactJS. To see this library in action,
and to view documentation of supported form fields, visit
https://formally.immutablesoft.org

## Install the library

```
npm install --save @immutablesoft/form-render
```

## Import and Use the library

This application requires React (a peerDependency of the library).
Below is an example of using FormRender to render a sign up page in React.

```
import { FormRender, FormRenderToObject, FormRemoveSeparatorsAndHeader } from "@immutablesoft/form-render"

const handleSignUpSubmit = async event => {
  event.preventDefault();

  // Read and parse the submitted form data
  const rawFormData = new FormData(event.target);
  const data = FormRemoveSeparatorsAndHeader(rawFormData);
  const resultJSON = FormRenderToObject(data);

  const agree = data.get('agree');
  console.log("agree:" + agree);
  if (agree === "on")
  {
    alert("The terms were agreed upon.");

    // TODO: Submit formData 'data' to your backend server?
    //       Or save 'resultJSON' to local storage?
  }
  else
    alert("The terms must be agreeable to sign up.");
};
  
function SignUpForm(onSubmit)
{
  const formData = [{"name":"username","min":"3","max":"32","type":"text"},
                    {"name":"password","min":"5","max":"32","type":"password"},
                    {"name":"email","min":"3","max":"128","type":"email"},
                    {"name":"agreement","value":"Example EULA. Blah blah blah.","type":"display"},
                    {"name":"agree","description":"I have read and agree.","type":"checkbox"}];
  const formName = {"name":"SignUp", "version":"1.0"};
  var formStyle = {};
  formStyle.form = { color: "grey" };
  formStyle.checkbox = { align: "left" };
  formStyle.textarea = { width: "95%" };
  formStyle.input = { width: "90%" };
  formStyle.title = { display: "none" };
  formStyle.labels = { display: "none" };
  formStyle.span = { display: "none" };
  formStyle.image = { borderRadius: "50%" };

  return (<div>
            <FormRender nameObj={formName} renderFields={formData}
                        handleSubmitFunction={onSubmit} logo={null}
                        submitString={"Create Account"} style={formStyle} />
          </div>);
}

...

// Render the sign up form
SignUpForm(handleSignUpSubmit);

```
