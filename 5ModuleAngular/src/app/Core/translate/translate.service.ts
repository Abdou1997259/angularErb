export class Translate{
    translatefun()
    {
      debugger
      if(window.sessionStorage.getItem("lan")==="English")
      {
        let listOfElement=document.getElementsByClassName("translate");
        let regex=/[\u0600-\u06FF]/
        for(let i=0;i<listOfElement.length;++i)
        {
            if(listOfElement[i].nodeName=='INPUT')
            {
              let inputElement=(listOfElement[i] as HTMLInputElement);
              if( regex.test(inputElement.value))
              {
              
               let enWord=listOfElement[i].getAttribute("data-en") as string ;
               let arword=inputElement.value;
               let swapper=enWord;
               enWord=arword;
               arword=swapper;
               listOfElement[i].setAttribute("data-en",enWord);
               inputElement.value=arword;
              }
  
            }
            else
            {
              if( regex.test(listOfElement[i].innerHTML))
              {
              
               let enWord=listOfElement[i].getAttribute("data-en") as string ;
               let arword=listOfElement[i].innerHTML;
               let swapper=enWord;
               enWord=arword;
               arword=swapper;
               listOfElement[i].setAttribute("data-en",enWord);
               listOfElement[i].innerHTML=arword;
              }
        
           
           
           
           
           
           
           
           
           
           
           
           
        }
    
      }
      }
    }
    translateData()
    {
      setTimeout(() => {
        if(window.sessionStorage.getItem("lan")==="English")
      {
        debugger
        let listOfElement=document.getElementsByClassName("translatedata");
        let regex=/[\u0600-\u06FF]/
        for(let i=0;i<listOfElement.length;++i)
        {
        
            if( regex.test(listOfElement[i].innerHTML))
               {
               
                let enWord=listOfElement[i].getAttribute("data-en") as string ;
                let arword=listOfElement[i].innerHTML;
                let swapper=enWord;
                enWord=arword;
                arword=swapper;
                listOfElement[i].setAttribute("data-en",enWord);
                listOfElement[i].innerHTML=arword;
               }
        }
    
      }
      }, 0);
      
    }
}