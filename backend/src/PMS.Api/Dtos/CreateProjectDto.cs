namespace PMS.Api.Dtos
{
    public class CreateProjectRequest
    {
        public string Title { get; set; }
        public string Description { get; set; }
    }
    public class UpdateProjectRequest
    {
        public string Title { get; set; }
        public string Description { get; set; }

        public MyEnum.Priority? Priority { get; set; }

        public MyEnum.Status? Status { get; set; }
    }
}
