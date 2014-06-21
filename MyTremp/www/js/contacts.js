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
        function(oContact)
        {
            return  '<div class="smallContactContainer" onclick="contacts.deleteContact(\''+oContact.name+'\',\''+oContact.phone+'\');">'+
                        '<div class="smallContactName">'+oContact.name+'</div>'+
                        '<div class="smallContactPhone">'+oContact.phone+'</div>'+
                    '</div>';
        }
}
var contacts =
{
    savedContacts: Array(),
    currentDeleteName:'',
    currentDeletePhone:'',
    draw: function () {
        var view = '';
        for (var iContact in contacts.savedContacts)
        {
            view += contact.smallView(contacts.savedContacts[iContact]);
        }
        document.getElementById('idContactsContainer').innerHTML = view;
    },
    chooseContact: function()
    {
        contacts.savedContacts.push(contact.new('דביר כהן','044499449-4'));
        contacts.savedContacts.push(contact.new('dvir cohen','044499449-4'));
        contacts.save();
        contacts.draw();

        window.plugins.PickContact.chooseContact(function(data) {
            var nContact = contact.new(data.displayName ,data.phoneNr );
            contacts.savedContacts.push(nContact);
            contacts.save();
            contacts.draw();
        });
    },

    deleteContact: function(name,phone)
    {
        contacts.currentDeleteName=name;
        contacts.currentDeletePhone=phone;
        // Confirm delete,
        navigator.notification.confirm('האם למחוק את איש קשר החירום?',
            function(choosed)
            {
                if (choosed == 2)
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
            },'אישור מחיקה','מחק, בטל'
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
        contacts.draw();
    }
}

