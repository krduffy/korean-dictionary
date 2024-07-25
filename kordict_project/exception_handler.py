from rest_framework.views import exception_handler

def custom_exception_handler(exc, context):
    # Call REST framework's default exception handler first,
    # to get the standard error response.
    response = exception_handler(exc, context)

    # Custom error messages because the ErrorMessage component looks for the first
    # key in response.data to end in 'errors'. by default, "Not found" for 404 etc
    # will be in 'detail'
    if response is not None:
      if response.status_code == 401 or response.status_code == 403:
         response.data['errors'] = ['리소스에 접근할 권한이 없습니다.']
      if response.status_code == 404:
          response.data['errors'] = ['요청한 리소스를 찾을 수 없습니다.']

    return response