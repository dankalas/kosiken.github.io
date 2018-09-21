/***********************************************************************
 * This is the code for the crow nests 
 * 
 * explaining provided by me
 *   Copyright (C) 2018  Lion Inc
 * 
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * Copyright (C) Marijn Haverbeke 2018
 ***************************************************************************/

/* all the objects classes and functions are wrapped inside this function
    and then exported*/

(
    function(){

        // connections (all nests that have a connections to a nest or nests)
        const connections = ["Church Tower-Sportsgrounds","Church Tower-Big Maple","Big Maple-Sportsgrounds",
        
        "Big Maple-Woods", "Big Maple-Fabienne's Garden", "Fabienne's Garden-Woods",
    
        "Fabienne's Garden-Cow Pasture", "Cow Pasture-Big Oak", "Big Oak-Butcher Shop",
    
        "Butcher Shop-Tall Poplar", "Tall Poplar-Sportsgrounds", "Tall Poplar-Chateau",
    
        "Chateau-Great Pine", "Great Pine-Jaques' Farm", "Jaques' Farm-Hawthorn",
        
        "Great Pine-Hawthorn", "Hawthorn-Gilles' Garden", "Great Pine-Gilles' Garden",
    
        "Gilles' Garden-Big Oak", "Gilles' Garden-Butcher Shop", "Chateau-Butcher Shop"];
    
        function storageFor(name){
            // storageFor generates a fixed property and  a fixed prop nd random prop for the storage of a given nest
            let storage = Object.create(null)
            storage["food caches"] = ["cache in the oak", "cache in the meadow", "cache under the hedge"];

            storage["cache in the oak"]="A hollow above third branch. Bread";

            storage["cache in the meadow"] ="Burried at (south side). A dead snake";

            storage[ "cache under the hedge"] = "Midde of hedge. Beer";

            storage["enemies"] = ["Farmer Jaques' dog", "The Butcher", "The one legged jackdaw", "The boy with the airgun"];

            if(name == "Chuch Tower" || name =="Hawthorn" || name == "Chateau" )
            storage["events on 2017-12-21"]= "Deep snow. Garbage . Ravens";

            let hash = 0;
            //gets the sum os the unicode of d characters given in name parameter all this just for chicks 
                                                                                                            
            for(let i = 0; i<name.length;i++) hash += name.charCodeAt(i);
           //counts 34 years; i guess thats a long time in crow years 
            for (let y = 1985; y<=2018;y++)
            {//gen rnd chick numbers that are not > 6 i.e hash % 6
                storage[`chicks in ${y}`] = hash % 6;
                hash = Math.abs((hash << 2) ^ (hash + y))
            }

            //assigns a present  scapel property to the nests that are in the if block 
            if(name == "Big Oak")             storage.scapel = "Gilles' Garden"

            else if(name ==" Gilles' Garden")            storage.scapel= "Woods"

            else if(name == "Woods")            storage.scapel = "Chateau"

            else if(name == "Chateau" || name == "Butcher Shop")           storage.scapel = "Butcher Shop"

            else storage.scapel = "Big Oak"

            //converts each value of storage to JSON format (|'__'|)
            for(let prop of Object.keys(storage)) storage[prop]= JSON.stringify(storage[prop])
            // guess it makes it look cooler in some distally convoluted way
            return storage
//ps distally is not a word
        }


        //Network class declaration 
        class Network {

            //I guess this builds like a baseline structure for networks
            constructor(connections,storageFor){
                let reachable = Object.create(null)

                for(let [from, to] of connections.map(conn => conn.split("-"))){
                    ; (reachable[from] || (reachable[from]= [])).push(to)
                    ; (reachable[to] || (reachable[to]= [])).push(from)
                }
                this.nodes = Object.create(null)
                for(let name of Object.keys(reachable))
                this.nodes[name] = new Node(name, reachable[name], this, storageFor(name))

                this.types = Object.create(null)
                
            }
            //method parameter handler is a function to be used to create this.types object parameter 
            defineRequestType(name,handler){

            this.types[name] = handler
            }
//method e does somein to eryone i guess  and  f is a function not sure if its a callback 
            everywhere(f){
                for(let node of Object.values(this.nodes))
                f(node)
            }
        }

//symbols yey ('_')
        const $storage = Symbol("storage"), $network = Symbol("network")
        
        //i cant figure the use of this function just converting stuff one place to  another ??
        function ser (value){//why do you exist!! arrrrgh!!!
            return value  = null ? null :
           JSON.parse(JSON.stringify(value))
        }

//declare class Node
        class Node{

            constructor (name,neighbours,network,storage){

            this.name= name
            this.neighbours = neighbours
            this[$network] = network
            this[$storage] = storage 
            }

            send(to,type,message,cb){
                let toNode = this[$network].nodes[to]

                if(!toNode || !this.neighbours.includes(to))
                return cb(new Error (`${to} is not reachable from ${this.name}`))

                let handler = this[$network].types[type]
                if(!handler) return cb(new Error("unknown request" + type))

                if (Math.random()> 0.03)setTimeout(()=>{
                    try{
                        //there's the ser again |(:-()| dude stop converting string mann urghhh!!!
                        handler(toNode, ser(message), this.name, (error,response)=>{
                            setTimeout(()=> cb(error,ser(response)),10)
                        })
                    }catch(e){
                        cb(e)
                    }
                },10 * Math.floor(Math.random()* 100))
            }

            readStorage(name,cb){
                let value = this[$storage][name]
                setTimeout(()=>
                    cb(value && JSON.parse(value)), 20)
            }

            writeStorage(name,value,cb){
                setTimeout(()=>{
                    this[$storage][name]= JSON.stringify(value)
                    cb()
                },20)
            }
        }
/*******************************************
 * exporting stuff
 *
 * network is like our skeleton class 
 *   let network  = new Network(connections,storageFor)
      
        exports.bigOak = network.nodes["Big Oak"]

        exports.everywhere= network.everywhere.bind(network)

        exports.defineRequestType = network.defineRequestType.bind(network)
 * 
 * 
************************************************************/       

        let network  = new Network(connections,storageFor)
      
        exports.bigOak = network.nodes["Big Oak"]

        exports.everywhere= network.everywhere.bind(network)

        exports.defineRequestType = network.defineRequestType.bind(network)

        //n now some crazy sandbox stuff
        if (typeof __sandbox !="undefined"){
            __sandbox.handleDeps = false;
            __sandbox.notify.onLoad = ()=> {

                //some stuff

                let waitFor = Date.now()+ 500;

                function wrapWaiting(f){
                    return function(...args){
                        let wait = waitFor - Date.now()

                        if (wait<0)return f(...args)

                        return  new Promise (ok => setTimeout(ok,wait)).then(()=> f(...args))
                            
                    }
                }
                for(let n of ["routeRequest, findInStorage, chicks"])
                window[n]= wrapWaiting(window[n])
            }
        }


        if (typeof window !="undefined")
        
       {
            window.require = name =>{
                if (name!= "./crow-tech")throw new Error("crow nests can only req \"./crow-tech")
                return exports;
            }
                }else if(typeof module != "undefined"&&module.exports){
                    module.exports = exports 
                }

    

    }
    )()


    