"use strict"

//object containing key categories that can be clicked
var kclass = {
  //number
  NUM: 1,
  //dot
  DOT: 2,
  //operator
  OP: 3,
  //clear entry
  CE: 4,
  //equal
  EQ: 5
}

//object containing states
var states = {
  //default state
  START: 1,
  //when the first number is added
  FIRST_ARG: 2,
  //when the first number begins with a dot (0.) or when it has a dot anywhere else
  FIRST_ARG_FLOAT: 3,
  //when the operator is added
  OP: 4,
  //when the second number is added
  SECOND_ARG: 5,
  //when the second number has a dot not at its beginning
  SEC_ARG_FLOAT: 6,
  //when the second number begins with a dot (0.)
  SEC_ARG_DOT: 7,
  //when we get the result of the arithmetical operation
  EQ: 8
}

//default state of the calculator
  $("#display").text(0);

//object containing variables and functionality related to the calculator
var calc = {
  //monitors current state
  state: states.START,
  //monitors current operator
  op: "",
  //monitors what is currently displayed on the display
  disp: "",
  //stores the first number for further operations
  acc1: "",
  //stores the second number for further operations
  acc2: "",
  //function that controls transitions between states using switch
  //two arguments - key_class(key category), key(specific key)
  doStep: function(key_class, key){
      switch (this.state){
         case states.START:
            if(key_class === kclass.NUM){
                //state action
                this.dispSet(key);
                //move to the next state
                this.state = states.FIRST_ARG;
            }
            if(key_class === kclass.DOT){
                this.dispSet("0.");
                this.state = states.FIRST_ARG_FLOAT;
            }
            break;
        case states.FIRST_ARG:
            if(key_class === kclass.NUM){
                this.dispAppend(key);
                this.state = states.FIRST_ARG;
            }
            if(key_class === kclass.OP){
                this.op = key;
                //store a value of the disp in an acc1 variable in order to be able to store the second number in the disp
                this.acc1 = this.disp;
                this.state = states.OP;
            }
            if(key_class === kclass.DOT){
                this.dispAppend(key);
                this.state = states.FIRST_ARG_FLOAT;
            }
            if(key_class === kclass.CE){
                this.dispSet("0");
                calc.state = states.START
            }
            break;
        case states.FIRST_ARG_FLOAT:
            if(key_class === kclass.NUM){
                this.dispAppend(key);
                this.state = states.FIRST_ARG_FLOAT;
            }
            if(key_class === kclass.OP){
                this.op = key;
                //store value of the disp in a acc1 variable in order to be able to store second number in the disp
                this.acc1 = this.disp;
                this.state = states.OP;
            }
            if(key_class === kclass.CE){
                this.dispSet("0");
                calc.state = states.START;
            }
            break;
        case states.OP:
            if(key_class === kclass.NUM){
                this.dispSet(key);
                this.state = states.SECOND_ARG;
            }
            if(key_class === kclass.DOT){
                this.dispSet("0.");
                this.state = states.SEC_ARG_DOT;
            }
            break;
        case states.SECOND_ARG:
            if(key_class === kclass.DOT){
                this.dispAppend(key);
                this.state = states.SEC_ARG_FLOAT;
            }
            if(key_class === kclass.NUM){
                this.dispAppend(key);
                this.state = states.SECOND_ARG;
            }
            if(key_class === kclass.EQ){
                //store the second number in the acc2 variable so that we can use it if the equal sign is pressed more than once
                this.acc2 = this.disp;
                //calculate the result
                this.operation(this.acc1, this.disp);
                this.displayUpdate(this.disp);
                this.state = states.EQ;
             }
            if(key_class === kclass.OP){
                //calculate the result
                this.operation(this.acc1, this.disp);
                this.op = key;
                //store the result of the operation in the acc1 in order to be used in the next operation
                this.acc1 = this.disp;
                this.displayUpdate(this.disp);
                this.state = states.OP;
            }
            if(key_class === kclass.CE){
                this.dispSet("0");
                calc.state = states.OP;
            }
            break;
        case states.SEC_ARG_FLOAT:
            if(key_class === kclass.NUM){
                this.dispAppend(key);
                this.state = states.SEC_ARG_FLOAT;
            }
            if(key_class === kclass.EQ){
                this.acc2 = this.disp;
                this.operation(this.acc1, this.disp);
                this.displayUpdate(this.disp);
                this.state = states.EQ;
             }
             if(key_class === kclass.OP){
                 this.operation(this.acc1, this.disp);
                 this.op = key;
                 this.acc1 = this.disp;
                 this.displayUpdate(this.disp);
                 this.state = states.OP;
             }
             if(key_class === kclass.CE){
                 this.dispSet("0");
                 calc.state = states.OP;
             }
            break;
        case states.SEC_ARG_DOT:
            if(key_class === kclass.NUM){
                this.dispAppend(key);
                this.state = states.SEC_ARG_FLOAT;
            }
            if(key_class === kclass.CE){
                this.dispSet("0");
                calc.state = states.OP;
            }
            break;
        case states.EQ:
            if(key_class === kclass.EQ){
                this.operation(this.disp, this.acc2);
                this.displayUpdate(this.disp);
                this.state = states.EQ;
            }
            if(key_class === kclass.NUM){
                this.dispSet(key);
                this.state = states.FIRST_ARG;
            }
            if(key_class === kclass.OP){
                this.op = key;
                this.acc1 = this.disp;
                this.state = states.OP;
            }
            if(key_class === kclass.DOT){
                this.dispSet("0.");
                this.state = states.FIRST_ARG_FLOAT;
            }
            if(key_class === kclass.CE){
                this.dispSet("0");
                this.clearer();
            }
            break;
      }
  },
  //does all the arithmetical operations
  operation: function(first, sec){
      if(this.op === "÷"){
          this.disp = first / sec;
      }
      if(this.op === "-"){
          this.disp = first - sec;
      }
      if(this.op === "x"){
          this.disp = first * sec;
      }
      if(this.op === "+"){
          this.disp = Number(first) + Number(sec);
      }
      if(this.op === "%"){
          this.disp = first % sec;
      }
  },
  //restarts the calculator to the default state
  clearer: function(){
      $("#display").text(0);
      this.state = states.START;
      this.op;
      this.disp;
      this.acc1;
      this.acc2;
  },
  //appends a display var
  dispAppend: function(key){
      this.disp += key;
      this.displayUpdate(this.disp);
  },
  //set a new value to the display var
  dispSet: function(key){
      this.disp = key;
      this.displayUpdate(this.disp);
  },
  //display the display var
  displayUpdate: function(dispText){
      $("#display").text(dispText);
  }
}

//when any number is clicked
$(".digit").on("click", function(){
  calc.doStep(kclass.NUM, $(this).html());
})
//when the operator is clicked
$(".op_key").on("click", function(){
  calc.doStep(kclass.OP, $(this).html());
})
//when the equal sign is clicked
$(".equals").on("click", function(){
  calc.doStep(kclass.EQ, $(this).html());
})
//when the dot is clicked
$(".point").on("click", function(){
  calc.doStep(kclass.DOT, $(this).html());
})
//when AC clicked - clear all variable values
$(".allClear").on("click", function(){
  calc.clearer();
})
//when CE clicked - erase the last entered input
$(".clearEntry").on("click", function(){
  calc.doStep(kclass.CE, $(this).html());
})
