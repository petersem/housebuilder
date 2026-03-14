// wrapper pattern to pass a variable in before the middleware is called. 
export const sanitiser = function (action = "clean") {
    // options can be
    //      clean = to replace bad characters
    //      warn = log, but dont change anything
    //      disable = Dont log or do anything
    return (req, res, next) => {
        if (req.body != undefined) {
            if (action.toLowerCase() == "disable") {
                console.log(`** Sanitiser ** Disabled!`);
            } else {
                // Remove potentially dangerous characters
                for (let [key, value] of Object.entries(req.body)) {
                    const testBad = /[$&+,:;=?@#|'<>.^*()%!-]/.test(req.body[key]);
                    // if bad characters found, print to the log and santisise bad data
                    if (testBad) {
                        const display = () => {
                            console.log(`** Sanitiser ** (Mode: ${action})`);
                            console.log(`                From IP        ${req.connection.remoteAddress}`);
                            console.log(`                Logged at:     ${new Date().toLocaleString()}`)
                            console.log(`                Issue with:    body.${key}`);
                            console.log(`                Original text: ${req.body[key]} `);    
                        }

                        switch (action.toLowerCase()) {
                            case "clean":
                                display();
                                req.body[key] = req.body[key].replace(/[$&+,:;=?@#|'<>.^*()%!-]/g, "");
                                console.log(`                Sanitised to: ${req.body[key]} `);
                                break;
                            case "warn":
                                display();
                                console.log(`                ** Warning only`);
                                break;
                            case "fail":
                                res.status(500);
                                const errorMessage = `Sanitiser Error: IP: ${req.connection.remoteAddress} - Logged: ${new Date().toLocaleString()} - Issue: body.${key} - Text: ${req.body[key]}`; 
                                throw new Error(errorMessage)
                                break;
                            default:
                                res.status(500);
                                console.log(`** Sanitiser ** (Mode: ${action}) You have NOT SELECTED A VALID OPTION for sanitiser - no action taken !!!`);
                                res.json(`{message: sanitiser middleware triggered, but using invalid option '${action}' - No action taken }`);
                                return;
                                break;
                        }
                    }
                }

            }
        }
        next();
    }
}