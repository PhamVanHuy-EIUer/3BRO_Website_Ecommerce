namespace Ecommerce3BRO.Service
{
    public class ApiResponse<T>
    {

        public IEnumerable<T>? List { get; set; }
        public T? Object { get; set; }
        public string Code { get; set; }
        public string Message { get; set; }
        public Dictionary<string, string[]>? Error { get; set; }
        public bool IsSuccess { get; set; }
        public string? String { get; set; }
        public int? Int { get; set; }
        public int CurrentPage { get; set; }
        public int PageSize { get; set; }
        public int TotalPage { get; set; }

        public int TotalElement { get; set; }




        public ApiResponse(IEnumerable<T>? List, T? Object, string Code, string Message,  bool IsSuccess, int CurrentPage, int PageSize, int TotalPage, int TotalElement, string? String, int? Int, Dictionary<string, string[]>? Error = null)
        {
            this.List = List;
            this.Object = Object;
            this.Code = Code;
            this.Message = Message;
            this.IsSuccess = IsSuccess;
            this.CurrentPage = CurrentPage;
            this.PageSize = PageSize;
            this.TotalPage = TotalPage;
            this.TotalElement = TotalElement;
            this.String = String;
            this.Int = Int;
            this.Error = Error;
        }


    }

}
