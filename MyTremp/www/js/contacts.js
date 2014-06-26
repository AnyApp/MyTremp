/**
 * Manage the contacts.
 */
var contact =
{
    new:
        function(name,phone)
        {
            return {
                name:name,
                phone:phone,
                equals: function(oContact)
                {
                    return this.name==oContact.name && this.phone==oContact.phone;
                }
            };
        },
    smallView:
        function(index,oContact)
        {
            return  '<ul><div id="smallContactViewId'+index+'" class="smallContactContainer">'+
                        '<div class="smallContactName">'+oContact.name+'</div>'+
                        '<div class="smallContactPhone">'+oContact.phone+'</div>'+
                    '</div></ul>';
        }
}
var contacts =
{
    baseId: 'smallContactViewId',
    savedContacts: Array(),
    loaded:false,
    currentDeleteName:'',
    currentDeletePhone:'',
    maxContactIndex:-1,
    draw: function () {
        var view = '';
        for (var iContact in contacts.savedContacts)
        {
            view += contact.smallView(iContact,contacts.savedContacts[iContact]);
            contacts.maxContactIndex = iContact;
        }
        document.getElementById('idContactsContainer').innerHTML = view;
        refreshScrolling();
        updateButtonClicks();
    },
    chooseContact: function()
    {
        //contacts.savedContacts.push(contact.new('דביר כהן','044499449-4'));
        //contacts.savedContacts.push(contact.new('dvir cohen','044499449-4'));
        //contacts.save();
        //contacts.draw();

        window.plugins.contactNumberPicker.pick(function(data) {
            var nContact = contact.new(data.name  ,data.phoneNumber );
            contacts.savedContacts.push(nContact);
            contacts.save();
            contacts.draw();
        },function(){data} );
    },

    deleteContact: function(name,phone)
    {
        window.console.log(name+","+phone);
        contacts.currentDeleteName=name;
        contacts.currentDeletePhone=phone;
        // Confirm delete,
        alertify.set({ labels: {ok: "מחק",cancel : "בטל" } });
        alertify.confirm('האם למחוק את איש קשר החירום?',
            function(choosed)
            {
                if (!choosed)
                {
                    contacts.currentDeleteName='';
                    contacts.currentDeletePhone='';
                    return;
                }

                var newContactList = Array();
                for (var iContact in contacts.savedContacts)
                {
                    var curContact = contacts.savedContacts[iContact];
                    if (!(name==curContact.name && phone==curContact.phone))
                    {
                        newContactList.push(curContact);
                    }
                }

                contacts.currentDeleteName='';
                contacts.currentDeletePhone='';

                contacts.savedContacts = newContactList;
                contacts.save();
                contacts.draw();
            }
        );


    },
    save: function()
    {
        window.localStorage.setItem("contacts", JSON.stringify(contacts.savedContacts));
    },
    load: function()
    {
        contacts.savedContacts = JSON.parse(window.localStorage.getItem("contacts"));
        if (contacts.savedContacts ==null || contacts.savedContacts==undefined || contacts.savedContacts=='')
        {
            contacts.savedContacts = Array();
        }
        contacts.loaded = true;
        contacts.draw();
    },
    getContacts: function()
    {
       if(contacts.savedContacts==null || contacts.savedContacts==undefined || !contacts.loaded)
       {
           contacts.savedContacts = JSON.parse(window.localStorage.getItem("contacts"));
           if (contacts.savedContacts ==null || contacts.savedContacts==undefined || contacts.savedContacts=='')
           {
               contacts.savedContacts = Array();
           }
       }
        contacts.loaded = true;
       return contacts.savedContacts;
    }
}

