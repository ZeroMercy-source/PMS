using PMS.Api.Models;

namespace PMS.Api.Domain

{
    public class UserDomain
    {

        public static void ReNameUser(User user, String name)
        {
            user.Name = name;
        }


    }
}
