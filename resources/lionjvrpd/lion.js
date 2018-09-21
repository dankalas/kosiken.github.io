
/***********************************************************************
 * 
 *  Copyright (C) 2018  Lion Inc
 * 
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * ALLISON KOSISOCHUKWU KENECHUKWU [allisonkosy@gmail.com]
 ***************************************************************************/

/**
 * A simple programming language parser called lion, lion is based on JavaScript model
 * Daniel Caeser and Jhene Aiko and Ruth B's music was involved
 * the full language project is one that would be used on a web app programmng gamme 
 * this code is highly influenced on Marjin  Haverbeke's book; Eloquent Javascript and is only a model
 * 
 * 
 * The real project is to develop an application to make simple and amazing games using a specialized 
 * programming language 
 * email allisonkosy@gmail.com if you are intrested in finding out more about the main programming code or you 
 * want to sponsor and/join Lion Inc's projects.
 *www.allisonkosyisalion.com
 */
// creating the error class
//inheritance
class ErrWrong extends Error{};



// just to skip white space 
function skipSpace(string){
    let first = string.search(/\S/);
    if(first==-1)return "";
    return string.slice(first)
}

function parseLionExp(program){
// declarations
    program = skipSpace(program);
    let match;
    let expr;
    
    // matches strings 
    if(match = /^"([^"]*)"/.exec(program)){
    expr = {lion: "string", equi: match[1]}
    
     // matches numbers 
    } else if (match = /^\d+\b/.exec(program)) {
    expr = {lion: "number", equi: Number(match[0])};

    } 
     // matches letters or anything that  isn't /s(),>+/."
    else if (match = /^[^\s(),>+\."]+/.exec(program)) {
    expr = {lion: "word", name: match[0]};

    } 
    // cheks if . is put before the end or , is inbetween an expression and another , eg a (!,),b [!
// indicates the ilegal ,]
    else {
            throw new ErrWrong("Expected: . or another expression before   " + program[0]);
            
}
// cuts out the first match and wraps it like  if it matches a then expr ={ lion: 'word', equi: 'a' }
// removes the  match from program string 
return putApply(expr, program.slice(match[0].length))
}

function putApply(expr,program){
    //more space skipping 
    program = skipSpace(program);

         //checking if program is not an application 
    if (program[0]!= "("){
   // returns if program is not an application 
        return parseLionExpEnd(expr,program)
    }
    
    
    //removes "("
    program = skipSpace(program.slice(1));
    expr = {lion: "apply", operator: expr, args: []};

//checks if there's a dot before the end
    if(program[0] == "."&& program.length > 1){
        return  parseLionExpEnd(expr,program)
    }

// populates the expression array 
    while(program[0] != "."){
        let arg = parseLionExp(program)

        //checking if arg is null ie if bracket is closed
        if(!arg){
            throw new ErrWrong("Expected: . ff or another expression before  " + program[0]);
        }
        expr.args.push(arg.expr);
        program = skipSpace(arg.rest);

        if (program[0] ==","){
            program = skipSpace(program.slice(1));
            //checks if there's a dot after ","
            if(program[0]== "."){
                return parseLionExpEnd(expr,program)
            }
        }else if(program[0]==")"){
            program = skipSpace(program.slice(1));
        }

         else if (program[0] != ".") {
            throw new ErrWrong("Expected '.' ");
        }
    }
    //recursion
    return putApply(expr,program.slice(1));
}   
  
//checks for the end of program 
function parseLionExpEnd(expr, program){
    if (program[0] != "."){
            return {expr: expr, rest: program};
        }else{
           //checks for exp after dot
            if(program[0]&& program.length > 1 ){
                throw new ErrWrong("Expected ',' or ')' or expression ");
            }
           
        }
    }

    function parse(program) {
        let {expr, rest} = parseLionExp(program);
        if (skipSpace(rest).length > 0) {
        throw new SyntaxError("Unexpected text after program "+ rest);
        }
        return expr;
    }


    try{
        opo()
    }catch(e ){
        if (e instanceof ErrWrong|| e instanceof SyntaxError)
        console.log(e)}
     function opo(){  console.log(parse('-(a, b, 10, "uu").'));}
// for operations like if, for, while,do, wdgwz
const specialForms = Object.create(null);

//evaluates the result of code instructions given with a given scope
function evaluate(expr,scope){
    //checking type of expression
    if (expr.lion == "string"|| expr.lion == "number") {
        //returns if the expression is a number or string
        return expr.equi;
        }else if (expr.lion== "word") {
            if (expr.name in scope){
                return scope[expr.name]
            } else {
                throw new ReferenceError(
                `Undefined binding: ${expr.name}`);
                }
        }else if (expr.lion == "apply") {
            // destructuring 
            let {operator, args} = expr;

            if (operator.lion == "word" &&
            operator.name in specialForms) {
            return specialForms[operator.name](expr.args, scope);
                
            }else {
                let op = evaluate(operator, scope);
                if (typeof op == "function") {
                    return op(...args.map(arg => evaluate(arg, scope)));
                    } else {
                    throw new TypeError("Applying a non existent function.");
                    }
            }
        }
}
  //populating specialForms object
specialForms.if = (args, scope) => {
    if (args.length != 3) {
    throw new SyntaxError("Wrong number of args to if");
    } else if (evaluate(args[0], scope) !== false) {
    return evaluate(args[1], scope);
    } else {
    return evaluate(args[2], scope);
    }
    };

    specialForms.while = (args, scope) => {
        if (args.length != 2) {
            throw new SyntaxError("Wrong number of args to while");
            }
            while (evaluate(args[0], scope) !== false) {
            evaluate(args[1], scope);
            }
            // Since undefined does not exist in Lion, we return false,
            // for lack of a meaningful result.
            return false;
            };

            specialForms.do = (args, scope) => {
                let value = false;
                for (let arg of args) {
                value = evaluate(arg, scope);
                }
                return value;
                };

                specialForms.roar = (args, scope) => {
                    if (args.length != 2 || args[0].lion!= "word") {
                    throw new SyntaxError("Incorrect use of roar construct");
                    }
                    let value = evaluate(args[1], scope);
                    scope[args[0].name] = value;
                    return value;
                    };

//the sample scope obect being used
                    const topScope = Object.create(null);
topScope.true = true;
topScope.false = false;

// let prog = parse(`if(true, false, true)`);
// console.log(evaluate(prog, topScope),prog);


for (let op of ["+", "-", "*", "/", "==", "<", ">"]) {
    topScope[op] = Function("a, b", `return a ${op} b;`);
    }

    topScope.print = value => {
        console.log(value);
        return value;
        };

        function run(program) {
            return evaluate(parse(program), Object.create(topScope));
            }
 

specialForms.fun = (args, scope) => {
    if (!args.length) {
    throw new SyntaxError("Functions need a body");
    }
    let body = args[args.length - 1];
    let params = args.slice(0, args.length - 1).map(expr => {
    if (expr.lion != "word") {
    throw new SyntaxError("Parameter names must be words");
    }
    return expr.name;
    });
    return function() {
        if (arguments.length != params.length) {
        throw new TypeError("Wrong number of arguments");
        }
        let localScope = Object.create(scope);
        for (let i = 0; i < arguments.length; i++) {
        localScope[params[i]] = arguments[i];
        }
        return evaluate(body, localScope);
        };
        };